-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations Table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users / Profiles Table (Links to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'engineer' CHECK (role IN ('admin', 'engineer')),
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Templates Table
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    schema_json JSONB NOT NULL,
    html_template TEXT, -- The raw HTML template string (Handlebars/Mustache)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Jobs Table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Progress', 'Ready for Review', 'Completed')),
    data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's org_id
CREATE OR REPLACE FUNCTION auth.user_org_id() 
RETURNS UUID AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policies

-- Profiles: Users can see profiles in their own org
CREATE POLICY "Users can view profiles in their org" ON public.profiles
    FOR SELECT USING (org_id = auth.user_org_id());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

-- Organizations: Users can view their own org
CREATE POLICY "Users can view their own organization" ON public.organizations
    FOR SELECT USING (id = auth.user_org_id());

-- Templates: Users can view templates in their own org
CREATE POLICY "Users can view templates in their org" ON public.templates
    FOR SELECT USING (org_id = auth.user_org_id());

-- Jobs: Users can view all jobs in their org (or restrict to own jobs based on preference, here we allow org-wide viewing)
CREATE POLICY "Users can view jobs in their org" ON public.jobs
    FOR SELECT USING (org_id = auth.user_org_id());

CREATE POLICY "Users can insert jobs in their org" ON public.jobs
    FOR INSERT WITH CHECK (org_id = auth.user_org_id() AND user_id = auth.uid());

CREATE POLICY "Users can update jobs in their org" ON public.jobs
    FOR UPDATE USING (org_id = auth.user_org_id());
