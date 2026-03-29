import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  CreditCard, 
  Users2, 
  Settings, 
  Search, 
  Plus, 
  Bell, 
  Menu, 
  X,
  Languages,
  ChevronRight,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Download,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore, translations, Client, Case } from './store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { 
    language, setLanguage, user, 
    clients, cases, hearings, payments, team,
    addClient, addCase 
  } = useAppStore();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [newCase, setNewCase] = useState({ clientId: '', title: '', number: '', court: '', type: '', status: 'active' as const, nextHearing: '' });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'clients', label: t.clients, icon: Users },
    { id: 'cases', label: t.cases, icon: Briefcase },
    { id: 'hearings', label: t.hearings, icon: Calendar },
    { id: 'documents', label: t.documents, icon: FileText },
    { id: 'payments', label: t.payments, icon: CreditCard },
    { id: 'team', label: t.team, icon: Users2 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const mobileNavItems = navItems.slice(0, 4);

  const stats = [
    { label: t.todayHearings, value: hearings.filter(h => h.date === '2026-03-29').length.toString(), color: 'bg-blue-500', icon: Calendar },
    { label: t.upcomingDates, value: hearings.length.toString(), color: 'bg-amber-500', icon: Bell },
    { label: t.pendingFees, value: '₹' + payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0).toLocaleString(), color: 'bg-rose-500', icon: CreditCard },
    { label: t.activeCases, value: cases.filter(c => c.status === 'active').length.toString(), color: 'bg-emerald-500', icon: Briefcase },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'clients') {
      addClient({ ...newClient, id: 'c' + Date.now() });
      setNewClient({ name: '', phone: '', email: '', address: '', notes: '' });
    } else if (activeTab === 'cases') {
      addCase({ ...newCase, id: 'cs' + Date.now(), nextHearing: newCase.nextHearing || 'TBD' });
      setNewCase({ clientId: '', title: '', number: '', court: '', type: '', status: 'active', nextHearing: '' });
    }
    setShowAddModal(false);
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery));
  const filteredCases = cases.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.number.includes(searchQuery));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 pb-20 lg:pb-0">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-[70] lg:relative",
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {(isSidebarOpen || !isMobile) && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-2xl font-bold tracking-tight text-white", !isSidebarOpen && !isMobile && "hidden")}
            >
              Vakil<span className="text-blue-400">Desk</span>
            </motion.h1>
          )}
          {!isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center p-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={22} className={cn(activeTab === item.id ? "text-white" : "group-hover:text-blue-400")} />
              {(isSidebarOpen || isMobile) && (
                <span className="ml-3 font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Languages size={22} />
            {(isSidebarOpen || isMobile) && (
              <span className="ml-3 font-medium">
                {language === 'hi' ? 'English' : 'हिंदी'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-40 px-4 lg:px-8 py-4 flex items-center justify-between border-b border-slate-200 lg:border-none">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="mr-4 p-2 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-slate-900 truncate max-w-[150px] lg:max-w-none">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-48 xl:w-64 shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all relative shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            {(activeTab === 'clients' || activeTab === 'cases') && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center w-10 h-10 lg:w-auto lg:px-4 lg:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={20} />
                <span className="hidden lg:inline ml-2 font-medium">{activeTab === 'clients' ? t.addClient : t.addCase}</span>
              </button>
            )}
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 lg:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                  >
                    <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white mb-3 lg:mb-4 shadow-lg", stat.color)}>
                      <stat.icon size={isMobile ? 20 : 24} />
                    </div>
                    <h3 className="text-slate-500 font-medium text-xs lg:text-base truncate">{stat.label}</h3>
                    <p className="text-xl lg:text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Cases & Hearings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900">{t.todayHearings}</h3>
                    <button onClick={() => setActiveTab('hearings')} className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                      {language === 'hi' ? 'सभी' : 'All'} <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    {hearings.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center p-3 lg:p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 text-blue-600 rounded-lg flex flex-col items-center justify-center font-bold text-[10px] lg:text-xs">
                          <span>{h.date.split('-')[2]}</span>
                          <span>{new Date(h.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                        </div>
                        <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm lg:text-base">
                            {cases.find(c => c.id === h.caseId)?.title || 'Unknown Case'}
                          </h4>
                          <p className="text-xs lg:text-sm text-slate-500 truncate">{h.purpose}</p>
                        </div>
                        <div className="text-right ml-2">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Urgent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900">{language === 'hi' ? 'हालिया केस' : 'Recent Cases'}</h3>
                    <button onClick={() => setActiveTab('cases')} className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                      {language === 'hi' ? 'सभी' : 'All'} <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {cases.slice(0, 4).map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                        <div className="flex items-center min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 shrink-0">
                            <Briefcase size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate">{c.number}</p>
                            <p className="text-xs text-slate-500 truncate">{clients.find(cl => cl.id === c.clientId)?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            c.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {c.status === 'active' ? t.active : t.closed}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <motion.div 
                    layout
                    key={client.id} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                        {client.name.charAt(0)}
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{client.name}</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Phone size={16} className="mr-2" /> {client.phone}
                      </div>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Mail size={16} className="mr-2" /> {client.email}
                      </div>
                      <div className="flex items-center text-slate-500 text-sm">
                        <MapPin size={16} className="mr-2" /> {client.address}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {cases.filter(c => c.clientId === client.id).length} {t.cases}
                      </span>
                      <button className="text-slate-400 hover:text-blue-600 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Cases Tab */}
          {activeTab === 'cases' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">{t.caseNumber}</th>
                      <th className="px-6 py-4">{t.caseTitle}</th>
                      <th className="px-6 py-4">{t.clientName}</th>
                      <th className="px-6 py-4">{t.court}</th>
                      <th className="px-6 py-4">{t.nextHearing}</th>
                      <th className="px-6 py-4">{t.status}</th>
                      <th className="px-6 py-4">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-all cursor-pointer group">
                        <td className="px-6 py-4 font-bold text-slate-900">{c.number}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{c.title}</td>
                        <td className="px-6 py-4 text-slate-600">{clients.find(cl => cl.id === c.clientId)?.name}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{c.court}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-slate-600 text-sm">
                            <Clock size={14} className="mr-1 text-blue-500" /> {c.nextHearing}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                            c.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {c.status === 'active' ? t.active : t.closed}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hearings Tab */}
          {activeTab === 'hearings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{language === 'hi' ? 'आने वाली सुनवाई' : 'Upcoming Hearings'}</h3>
                <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">{language === 'hi' ? 'सूची' : 'List'}</button>
                  <button className="px-4 py-1.5 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-medium">{language === 'hi' ? 'कैलेंडर' : 'Calendar'}</button>
                </div>
              </div>
              
              {/* Calendar Mock */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h4 className="font-bold text-slate-900">March 2026</h4>
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-slate-50 rounded-lg border border-slate-200"><ChevronRight size={16} className="rotate-180" /></button>
                    <button className="p-1 hover:bg-slate-50 rounded-lg border border-slate-200"><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 min-w-[300px]">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-2">{d}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === 29;
                    const hasHearing = [29, 5].includes(day);
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative cursor-pointer",
                          isToday ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-600",
                          hasHearing && !isToday && "bg-blue-50 text-blue-600 font-bold"
                        )}
                      >
                        {day}
                        {hasHearing && (
                          <div className={cn("absolute bottom-1.5 w-1 h-1 rounded-full", isToday ? "bg-white" : "bg-blue-600")}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {hearings.map((h) => (
                  <div key={h.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-md transition-all">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="text-lg leading-none">{h.date.split('-')[2]}</span>
                        <span className="text-[10px] uppercase">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cases.find(c => c.id === h.caseId)?.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-slate-500 text-xs flex items-center">
                            <MapPin size={12} className="mr-1" /> {cases.find(c => c.id === h.caseId)?.court}
                          </span>
                          <span className="text-slate-500 text-xs flex items-center">
                            <Clock size={12} className="mr-1" /> 10:30 AM
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{h.purpose}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200">
                        {language === 'hi' ? 'नोट्स' : 'Notes'}
                      </button>
                      <button className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                        {language === 'hi' ? 'विवरण' : 'Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-all cursor-pointer shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                      <FileUp size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}</h3>
                    <p className="text-slate-500 mt-2 max-w-xs">{language === 'hi' ? 'PDF या इमेज फ़ाइलें यहाँ खींचें या क्लिक करें' : 'Drag and drop PDF or image files here or click to browse'}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{language === 'hi' ? 'हालिया फ़ाइलें' : 'Recent Files'}</h4>
                      <button className="text-blue-600 text-xs font-bold hover:underline">{language === 'hi' ? 'सभी देखें' : 'View All'}</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {[
                        { name: 'Petition_Draft_V1.pdf', size: '2.4 MB', date: '28 Mar', type: 'pdf' },
                        { name: 'Evidence_Photo_01.jpg', size: '1.1 MB', date: '27 Mar', type: 'image' },
                        { name: 'Court_Order_Final.pdf', size: '0.8 MB', date: '25 Mar', type: 'pdf' },
                        { name: 'Vakalatnama_Signed.pdf', size: '1.5 MB', date: '24 Mar', type: 'pdf' },
                      ].map((file, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all group">
                          <div className="flex items-center min-w-0">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                              file.type === 'pdf' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                            )}>
                              {file.type === 'pdf' ? <FileText size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="ml-3 min-w-0">
                              <p className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">{file.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{file.size} • {file.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Download size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">{language === 'hi' ? 'श्रेणियाँ' : 'Categories'}</h4>
                    <div className="space-y-2">
                      {[
                        { label: language === 'hi' ? 'याचिकाएं' : 'Petitions', count: 12, color: 'bg-blue-500' },
                        { label: language === 'hi' ? 'साक्ष्य' : 'Evidence', count: 45, color: 'bg-amber-500' },
                        { label: language === 'hi' ? 'अदालती आदेश' : 'Court Orders', count: 8, color: 'bg-emerald-500' },
                        { label: language === 'hi' ? 'अन्य' : 'Others', count: 15, color: 'bg-slate-500' },
                      ].map((cat, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group">
                          <div className="flex items-center">
                            <div className={cn("w-2 h-2 rounded-full mr-3", cat.color)}></div>
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{cat.label}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-600/20 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="font-bold text-lg">{language === 'hi' ? 'क्लाउड स्टोरेज' : 'Cloud Storage'}</h4>
                      <p className="text-blue-100 text-xs mt-1">2.4 GB of 5 GB used</p>
                      <div className="w-full h-2 bg-blue-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-white w-[48%]"></div>
                      </div>
                      <button className="w-full mt-6 py-2 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
                        {language === 'hi' ? 'अपग्रेड करें' : 'Upgrade Plan'}
                      </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                      <FileUp size={120} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">{t.date}</th>
                      <th className="px-6 py-4">{t.caseTitle}</th>
                      <th className="px-6 py-4">{t.amount}</th>
                      <th className="px-6 py-4">{t.status}</th>
                      <th className="px-6 py-4">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-all">
                        <td className="px-6 py-4 text-slate-500 text-sm">{p.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{cases.find(c => c.id === p.caseId)?.title}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {p.status === 'paid' ? (
                              <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                <CheckCircle2 size={12} className="mr-1" /> {t.paid}
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                                <AlertCircle size={12} className="mr-1" /> {t.pending}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 text-xs font-bold hover:underline">{language === 'hi' ? 'रसीद' : 'Receipt'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xl">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{member.role}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Mail size={16} className="mr-2" /> {member.email}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Briefcase size={16} className="mr-2" /> {language === 'hi' ? '12 सक्रिय केस' : '12 Active Cases'}
                    </div>
                  </div>
                  <button className="w-full mt-6 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                    {language === 'hi' ? 'प्रोफ़ाइल देखें' : 'View Profile'}
                  </button>
                </div>
              ))}
              <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all">
                <Plus size={32} />
                <span className="mt-2 font-bold">{language === 'hi' ? 'टीम सदस्य जोड़ें' : 'Add Team Member'}</span>
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 bg-slate-900 text-white flex items-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-800">
                  RK
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold">{user?.name}</h3>
                  <p className="text-slate-400">{user?.firm}</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.name}</label>
                    <input type="text" defaultValue={user?.name} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.email}</label>
                    <input type="email" defaultValue="rajesh@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'hi' ? 'कार्यालय का पता' : 'Office Address'}</label>
                  <textarea rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
                  <button className="px-6 py-2 text-slate-600 font-bold">{t.cancel}</button>
                  <button className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20">{t.save}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {activeTab === 'clients' ? t.addClient : t.addCase}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                {activeTab === 'clients' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.name}</label>
                      <input 
                        required
                        type="text" 
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.phone}</label>
                        <input 
                          required
                          type="tel" 
                          value={newClient.phone}
                          onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.email}</label>
                        <input 
                          type="email" 
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.address}</label>
                      <input 
                        type="text" 
                        value={newClient.address}
                        onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.clientName}</label>
                      <select 
                        required
                        value={newCase.clientId}
                        onChange={(e) => setNewCase({...newCase, clientId: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">{language === 'hi' ? 'मुवक्किल चुनें' : 'Select Client'}</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.caseTitle}</label>
                      <input 
                        required
                        type="text" 
                        value={newCase.title}
                        onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.caseNumber}</label>
                        <input 
                          required
                          type="text" 
                          value={newCase.number}
                          onChange={(e) => setNewCase({...newCase, number: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.court}</label>
                        <input 
                          required
                          type="text" 
                          value={newCase.court}
                          onChange={(e) => setNewCase({...newCase, court: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Add Floating Button for Mobile */}
      {isMobile && !showAddModal && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (activeTab === 'clients' || activeTab === 'cases') {
              setShowAddModal(true);
            } else {
              setActiveTab('clients');
              setShowAddModal(true);
            }
          }}
          className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white"
        >
          <Plus size={28} />
        </motion.button>
      )}

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl transition-all min-w-[64px]",
                activeTab === item.id ? "text-blue-600" : "text-slate-400"
              )}
            >
              <item.icon size={20} className={activeTab === item.id ? "scale-110" : ""} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="w-1 h-1 bg-blue-600 rounded-full mt-0.5"
                />
              )}
            </button>
          ))}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center p-2 rounded-xl text-slate-400 min-w-[64px]"
          >
            <Menu size={20} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">{language === 'hi' ? 'मेनू' : 'Menu'}</span>
          </button>
        </nav>
      )}
    </div>
  );
}
