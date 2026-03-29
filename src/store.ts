import { create } from 'zustand';

type Language = 'hi' | 'en';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface Case {
  id: string;
  clientId: string;
  title: string;
  number: string;
  court: string;
  type: string;
  status: 'active' | 'closed' | 'pending';
  nextHearing: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  purpose: string;
  outcome: string;
}

export interface Payment {
  id: string;
  caseId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'partial';
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'admin' | 'advocate' | 'junior' | 'clerk';
  email: string;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: any | null;
  setUser: (user: any) => void;
  clients: Client[];
  cases: Case[];
  hearings: Hearing[];
  payments: Payment[];
  team: TeamMember[];
  addClient: (client: Client) => void;
  addCase: (caseItem: Case) => void;
  addHearing: (hearing: Hearing) => void;
  addPayment: (payment: Payment) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'hi',
  setLanguage: (lang) => set({ language: lang }),
  user: {
    id: '1',
    name: 'Adv. Rajesh Kumar',
    role: 'admin',
    firm: 'Kumar & Associates'
  },
  setUser: (user) => set({ user }),
  clients: [
    { id: 'c1', name: 'Amit Verma', phone: '9876543210', email: 'amit@example.com', address: 'New Delhi', notes: 'Property dispute' },
    { id: 'c2', name: 'Suresh Raina', phone: '9123456789', email: 'suresh@example.com', address: 'Ghaziabad', notes: 'Civil case' },
  ],
  cases: [
    { id: 'cs1', clientId: 'c1', title: 'Verma vs. State', number: 'CS/2024/001', court: 'District Court', type: 'Civil', status: 'active', nextHearing: '2026-03-29' },
    { id: 'cs2', clientId: 'c2', title: 'Raina vs. Municipal Corp', number: 'CS/2024/002', court: 'High Court', type: 'Civil', status: 'active', nextHearing: '2026-04-05' },
  ],
  hearings: [
    { id: 'h1', caseId: 'cs1', date: '2026-03-29', purpose: 'Evidence', outcome: '' },
    { id: 'h2', caseId: 'cs2', date: '2026-04-05', purpose: 'Argument', outcome: '' },
  ],
  payments: [
    { id: 'p1', caseId: 'cs1', amount: 5000, date: '2026-03-20', status: 'paid' },
    { id: 'p2', caseId: 'cs2', amount: 15000, date: '2026-03-25', status: 'pending' },
  ],
  team: [
    { id: 't1', name: 'Adv. Rajesh Kumar', role: 'admin', email: 'rajesh@example.com' },
    { id: 't2', name: 'Vikram Singh', role: 'junior', email: 'vikram@example.com' },
    { id: 't3', name: 'Pooja Sharma', role: 'clerk', email: 'pooja@example.com' },
  ],
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  addCase: (caseItem) => set((state) => ({ cases: [...state.cases, caseItem] })),
  addHearing: (hearing) => set((state) => ({ hearings: [...state.hearings, hearing] })),
  addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
}));

export const translations = {
  hi: {
    dashboard: "डैशबोर्ड",
    clients: "मुवक्किल",
    cases: "केस",
    hearings: "सुनवाई",
    documents: "दस्तावेज़",
    payments: "भुगतान",
    team: "टीम",
    settings: "सेटिंग्स",
    todayHearings: "आज की सुनवाई",
    upcomingDates: "आने वाली तारीखें",
    pendingFees: "बकाया फीस",
    activeCases: "सक्रिय केस",
    addClient: "नया मुवक्किल",
    addCase: "नया केस",
    search: "खोजें...",
    nextHearing: "अगली सुनवाई",
    caseNumber: "केस नंबर",
    court: "न्यायालय",
    status: "स्थिति",
    clientName: "मुवक्किल का नाम",
    phone: "फ़ोन",
    actions: "कार्रवाई",
    email: "ईमेल",
    address: "पता",
    notes: "नोट्स",
    save: "सहेजें",
    cancel: "रद्द करें",
    caseTitle: "केस का शीर्षक",
    caseType: "केस का प्रकार",
    amount: "राशि",
    date: "तारीख",
    role: "भूमिका",
    name: "नाम",
    all: "सभी",
    active: "सक्रिय",
    closed: "बंद",
    pending: "लंबित",
    paid: "भुगतान किया",
    partial: "आंशिक",
    purpose: "उद्देश्य",
    outcome: "परिणाम",
  },
  en: {
    dashboard: "Dashboard",
    clients: "Clients",
    cases: "Cases",
    hearings: "Hearings",
    documents: "Documents",
    payments: "Payments",
    team: "Team",
    settings: "Settings",
    todayHearings: "Today's Hearings",
    upcomingDates: "Upcoming Dates",
    pendingFees: "Pending Fees",
    activeCases: "Active Cases",
    addClient: "Add Client",
    addCase: "Add Case",
    search: "Search...",
    nextHearing: "Next Hearing",
    caseNumber: "Case Number",
    court: "Court",
    status: "Status",
    clientName: "Client Name",
    phone: "Phone",
    actions: "Actions",
    email: "Email",
    address: "Address",
    notes: "Notes",
    save: "Save",
    cancel: "Cancel",
    caseTitle: "Case Title",
    caseType: "Case Type",
    amount: "Amount",
    date: "Date",
    role: "Role",
    name: "Name",
    all: "All",
    active: "Active",
    closed: "Closed",
    pending: "Pending",
    paid: "Paid",
    partial: "Partial",
    purpose: "Purpose",
    outcome: "Outcome",
  }
};
