# VakilDesk Database Schema (PostgreSQL)

-- Firms / Law Offices (Multi-tenant root)
CREATE TABLE firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    contact_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Advocates, Clerks, Staff)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('admin', 'advocate', 'junior', 'clerk')) DEFAULT 'advocate',
    language_preference TEXT DEFAULT 'hi', -- 'hi' or 'en'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cases
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id),
    client_id UUID REFERENCES clients(id),
    case_title TEXT NOT NULL,
    case_number TEXT,
    court_name TEXT,
    case_type TEXT, -- Civil, Criminal, etc.
    opposite_party TEXT,
    stage TEXT, -- Filing, Evidence, Argument, etc.
    status TEXT CHECK (status IN ('active', 'closed', 'pending')) DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hearings (Dates)
CREATE TABLE hearings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id),
    hearing_date DATE NOT NULL,
    purpose TEXT, -- Evidence, Argument, Order, etc.
    outcome TEXT,
    next_hearing_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    document_type TEXT, -- Petition, Order, Affidavit
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments / Billing
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_type TEXT, -- Cash, UPI, Bank Transfer
    status TEXT CHECK (status IN ('paid', 'pending', 'partial')) DEFAULT 'paid',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks / Reminders
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES firms(id),
    assigned_to UUID REFERENCES users(id),
    case_id UUID REFERENCES cases(id),
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
