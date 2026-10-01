/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkOrder, ShopSettings, OSStatus } from './types/os';
import { 
  getStoredOrders, 
  saveOrders, 
  getStoredSettings, 
  saveSettings, 
  generateNextId,
  decodeCompressedOS 
} from './utils/storage';
import { WhatsAppMessageType } from './utils/whatsapp';
import { Navbar } from './components/Navbar';
import { WorkOrderList } from './components/WorkOrderList';
import { WorkOrderForm } from './components/WorkOrderForm';
import { WorkOrderDetail } from './components/WorkOrderDetail';
import { WorkOrderPrint } from './components/WorkOrderPrint';
import { ClientOnlineView } from './components/ClientOnlineView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ShopSettingsModal } from './components/ShopSettingsModal';

type AppView = 'list' | 'create' | 'edit' | 'detail' | 'print' | 'client_view';

export default function App() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(getStoredSettings());
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [previousView, setPreviousView] = useState<AppView>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Modals state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppModalType, setWhatsAppModalType] = useState<WhatsAppMessageType>('abertura');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize and check URL parameters for public online tracking link
  useEffect(() => {
    const loadedOrders = getStoredOrders();
    setOrders(loadedOrders);
    const loadedSettings = getStoredSettings();
    setSettings(loadedSettings);

    // Check if URL has ?os= or &data= parameter (client opened from WhatsApp)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const osParam = urlParams.get('os');
      const dataParam = urlParams.get('data');

      if (dataParam) {
        const decoded = decodeCompressedOS(dataParam);
        if (decoded && decoded.id) {
          // If already in list, use it; else insert or use temporary
          const existing = loadedOrders.find(o => o.id === decoded.id);
          if (existing) {
            setSelectedOrderId(existing.id);
          } else {
            // Save decoded OS so it's viewable
            const fullDecoded = decoded as WorkOrder;
            setOrders(prev => [fullDecoded, ...prev]);
            setSelectedOrderId(fullDecoded.id);
          }
          setCurrentView('client_view');
          return;
        }
      }

      if (osParam) {
        const matched = loadedOrders.find(o => o.id.toLowerCase() === osParam.toLowerCase());
        if (matched) {
          setSelectedOrderId(matched.id);
          setCurrentView('client_view');
        }
      }
    }
  }, []);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0] || null;

  // Handlers for Orders
  const handleSaveOrder = (orderData: WorkOrder, sendWhatsAppImmediately: boolean) => {
    let updatedOrders: WorkOrder[];
    const exists = orders.some(o => o.id === orderData.id);

    if (exists) {
      updatedOrders = orders.map(o => o.id === orderData.id ? orderData : o);
    } else {
      updatedOrders = [orderData, ...orders];
    }

    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    setSelectedOrderId(orderData.id);

    if (sendWhatsAppImmediately) {
      // Pick template based on status
      let msgType: WhatsAppMessageType = 'abertura';
      if (orderData.status === 'aguardando_aprovacao') msgType = 'orcamento';
      else if (orderData.status === 'pronta') msgType = 'pronto';
      else if (orderData.status === 'finalizada') msgType = 'finalizada';

      setWhatsAppModalType(msgType);
      setIsWhatsAppModalOpen(true);
      setCurrentView('detail');
    } else {
      setCurrentView('detail');
    }
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    saveOrders(updated);
    if (selectedOrderId === id) {
      setSelectedOrderId(null);
      setCurrentView('list');
    }
  };

  const handleStatusChange = (newStatus: OSStatus) => {
    if (!selectedOrder) return;
    const updatedOrder: WorkOrder = {
      ...selectedOrder,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    const updatedList = orders.map(o => o.id === selectedOrder.id ? updatedOrder : o);
    setOrders(updatedList);
    saveOrders(updatedList);

    // If status changed to important milestone, offer to send via WhatsApp
    if (newStatus === 'aguardando_aprovacao') {
      setWhatsAppModalType('orcamento');
      setIsWhatsAppModalOpen(true);
    } else if (newStatus === 'pronta') {
      setWhatsAppModalType('pronto');
      setIsWhatsAppModalOpen(true);
    } else if (newStatus === 'finalizada') {
      setWhatsAppModalType('finalizada');
      setIsWhatsAppModalOpen(true);
    }
  };

  const handleOpenWhatsAppModal = (os: WorkOrder, type: WhatsAppMessageType = 'abertura') => {
    setSelectedOrderId(os.id);
    setWhatsAppModalType(type);
    setIsWhatsAppModalOpen(true);
  };

  const handleSaveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleImportOrders = (imported: WorkOrder[]) => {
    setOrders(imported);
    saveOrders(imported);
  };

  const nextId = generateNextId(orders);

  // Render view
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Show Navbar when not in full print mode or pure client mobile view */}
      {currentView !== 'print' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'create') {
              setCurrentView('create');
            } else if (view === 'client_view') {
              setCurrentView('client_view');
            } else {
              setCurrentView('list');
            }
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          settings={settings}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {currentView === 'list' && (
          <WorkOrderList
            orders={orders}
            onSelectOrder={(order) => {
              setSelectedOrderId(order.id);
              setCurrentView('detail');
            }}
            onNewOrder={() => setCurrentView('create')}
            onSendWhatsApp={(order) => {
              let msgType: WhatsAppMessageType = 'abertura';
              if (order.status === 'aguardando_aprovacao') msgType = 'orcamento';
              else if (order.status === 'pronta') msgType = 'pronto';
              else if (order.status === 'finalizada') msgType = 'finalizada';
              handleOpenWhatsAppModal(order, msgType);
            }}
            onPrintOrder={(order) => {
              setSelectedOrderId(order.id);
              setCurrentView('print');
            }}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {currentView === 'create' && (
          <WorkOrderForm
            onSave={handleSaveOrder}
            onCancel={() => setCurrentView('list')}
            nextId={nextId}
            settings={settings}
          />
        )}

        {currentView === 'edit' && selectedOrder && (
          <WorkOrderForm
            initialData={selectedOrder}
            onSave={handleSaveOrder}
            onCancel={() => setCurrentView('detail')}
            nextId={selectedOrder.id}
            settings={settings}
          />
        )}

        {currentView === 'detail' && selectedOrder && (
          <WorkOrderDetail
            os={selectedOrder}
            settings={settings}
            onBack={() => setCurrentView('list')}
            onEdit={() => setCurrentView('edit')}
            onSendWhatsApp={() => {
              let msgType: WhatsAppMessageType = 'abertura';
              if (selectedOrder.status === 'aguardando_aprovacao') msgType = 'orcamento';
              else if (selectedOrder.status === 'pronta') msgType = 'pronto';
              else if (selectedOrder.status === 'finalizada') msgType = 'finalizada';
              handleOpenWhatsAppModal(selectedOrder, msgType);
            }}
            onPrint={() => {
              setPreviousView('detail');
              setCurrentView('print');
            }}
            onOpenOnlineView={() => setCurrentView('client_view')}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentView === 'print' && selectedOrder && (
          <WorkOrderPrint
            os={selectedOrder}
            settings={settings}
            onBack={() => setCurrentView(previousView)}
          />
        )}

        {currentView === 'client_view' && selectedOrder && (
          <ClientOnlineView
            os={selectedOrder}
            settings={settings}
            onSearchAnother={(code) => {
              const found = orders.find(o => o.id.toLowerCase() === code.toLowerCase());
              if (found) {
                setSelectedOrderId(found.id);
              } else {
                alert(`Ordem de Serviço ${code} não encontrada.`);
              }
            }}
            onBackToApp={() => setCurrentView('list')}
            onPrint={() => {
              setPreviousView('client_view');
              setCurrentView('print');
            }}
          />
        )}
      </main>

      {/* WhatsApp Modal Dialog */}
      {selectedOrder && (
        <WhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          os={selectedOrder}
          settings={settings}
          initialType={whatsAppModalType}
        />
      )}

      {/* Shop Settings Modal */}
      <ShopSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        orders={orders}
        onImportOrders={handleImportOrders}
      />
    </div>
  );
}
