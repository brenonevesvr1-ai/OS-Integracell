import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { ShopSettings } from '../types/os';
import { IntegracellLogo } from './IntegracellLogo';

interface NavbarProps {
  currentView: 'list' | 'create' | 'edit' | 'detail' | 'print' | 'client_view';
  onNavigate: (view: 'list' | 'create' | 'client_view') => void;
  onOpenSettings: () => void;
  settings: ShopSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  settings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with Integracell logo */}
        <div 
          onClick={() => onNavigate('list')}
          className="cursor-pointer select-none group"
        >
          <IntegracellLogo variant="horizontal" size={42} className="transition-transform group-hover:scale-[1.02]" />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => onNavigate('list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'list' || currentView === 'detail'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Painel de Ordens
          </button>

          <button
            type="button"
            onClick={() => onNavigate('client_view')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'client_view'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Portal Online do Cliente
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Configurações da Loja"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova OS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
