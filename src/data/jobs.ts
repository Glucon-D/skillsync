export interface JobListing {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    rating?: number;
    reviewCount?: number;
  };
  location: string | string[];
  experience: {
    min: number;
    max: number;
    unit: string;
  };
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  skills: string[];
  postedDate: string;
  jobType?: string;
  workMode?: string;
  description?: string;
  badges?: string[];
  applyUrl: string;
}

export interface JobsData {
  totalJobs: number;
  //   location: string;
  lastUpdated: string;
  filters: {
    salary: Array<{ range: string; count: number }>;
    departments: Array<{ name: string; count: number }>;
    companyTypes: Array<{ type: string; count: number }>;
    workModes: Array<{ mode: string; count: number }>;
    industries: Array<{ name: string; count: number }>;
    topCompanies: Array<{ name: string; count: number }>;
  };
  jobs: JobListing[];
}

export const JobsData: JobsData = {
  totalJobs: 7774,
  lastUpdated: "2025-10-30",
  filters: {
    salary: [
      { range: "0-3 Lakhs", count: 2307 },
      { range: "3-6 Lakhs", count: 5363 },
      { range: "6-10 Lakhs", count: 4086 },
      { range: "10-15 Lakhs", count: 1496 },
    ],
    departments: [
      { name: "Engineering - Software & QA", count: 1450 },
      { name: "Sales & Business Development", count: 1439 },
      { name: "Customer Success, Service & Operations", count: 581 },
      { name: "Marketing & Communication", count: 472 },
      { name: "Data Science & Analytics", count: 3245 },
      { name: "Finance & Accounting", count: 6758 },
    ],
    companyTypes: [
      { type: "Corporate", count: 1442 },
      { type: "Foreign MNC", count: 763 },
      { type: "Indian MNC", count: 487 },
      { type: "Startup", count: 242 },
    ],
    workModes: [
      { mode: "Work from office", count: 7597 },
      { mode: "Hybrid", count: 120 },
      { mode: "Remote", count: 57 },
    ],
    industries: [
      { name: "IT Services & Consulting", count: 2284 },
      { name: "Education / Training", count: 405 },
      { name: "Hotels & Restaurants", count: 404 },
      { name: "Medical Services / Hospital", count: 317 },
      { name: "Financial Services", count: 3839 },
      { name: "Recruitment / Staffing", count: 3227 },
      { name: "Banking", count: 2955 },
    ],
    topCompanies: [
      { name: "Accenture", count: 374 },
      { name: "Policybazaar", count: 54 },
      { name: "Capgemini", count: 480 },
      { name: "Deutsche Bank", count: 48 },
      { name: "Tata Capital", count: 32 },
      { name: "Wipro", count: 1359 },
      { name: "Infosys", count: 638 },
      { name: "Jones Lang LaSalle (JLL)", count: 452 },
      { name: "EY", count: 491 },
      { name: "Crisil", count: 360 },
    ],
  },
  jobs: [
    {
      id: "1",
      title: "Order To Cash Operations New Associate",
      company: {
        name: "Accenture",
        logo: "https://img.naukimg.com/logo_images/groups/v1/10476.gif",
        rating: 3.7,
        reviewCount: 68049,
      },
      location: "Jaipur",
      experience: {
        min: 0,
        max: 1,
        unit: "years",
      },
      skills: [
        "accounts receivable",
        "customer service",
        "order to cash",
        "cash applications",
        "billing",
        "service operations",
        "overseas education",
        "sales",
      ],
      postedDate: "1 week ago",
      workMode: "Work from office",
      description:
        "Skill required: Order to Cash - Cash Application Processing",
      applyUrl:
        "https://www.naukri.com/job-listings-order-to-cash-operations-new-associate-accenture-solutions-pvt-ltd-jaipur-0-to-1-years-161025918226",
    },
    {
      id: "2",
      title: "Team Member - Branch Facilities - CREM-SUPPORT SERVICES",
      company: {
        name: "Kotak Mahindra Bank",
        logo: "https://img.naukimg.com/logo_images/groups/v1/15184.gif",
        rating: 3.6,
        reviewCount: 20913,
      },
      location: "Jaipur",
      experience: {
        min: 0,
        max: 2,
        unit: "years",
      },
      skills: [
        "accounts receivable",
        "transformers",
        "accounts payable",
        "tds",
        "balance sheet",
        "mathematics",
        "general accounting",
        "auditing",
      ],
      postedDate: "5 days ago",
      workMode: "Work from office",
      applyUrl:
        "https://www.naukri.com/job-listings-team-member-branch-facilities-crem-support-services-kotak-mahindra-bank-limited-jaipur-0-to-2-years-221025507680",
    },
    {
      id: "3",
      title: "Genpact Hiring For Transactions (Non voice roles) || Jaipur",
      company: {
        name: "Genpact",
        logo: "https://img.naukimg.com/logo_images/groups/v1/42932.gif",
        rating: 3.6,
        reviewCount: 39098,
      },
      location: "Jaipur",
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      skills: [
        "Claims",
        "Non Voice",
        "Insurance Claims",
        "Claim Payment",
        "Transaction Processing",
        "Healthcare Bpo",
        "Medical Insurance",
        "Backend Operations",
      ],
      postedDate: "1 week ago",
      workMode: "Work from office",
      description:
        "Ready to shape the future of work? At Genpact, we don't just adapt to change we drive it",
      applyUrl:
        "https://www.naukri.com/job-listings-genpact-hiring-for-transactions-non-voice-roles-jaipur-genpact-jaipur-0-to-3-years-081025015972",
    },
    {
      id: "4",
      title: "Senior Executive",
      company: {
        name: "EXL",
        logo: "https://img.naukimg.com/logo_images/groups/v1/109516.gif",
        rating: 3.6,
        reviewCount: 8168,
      },
      location: "Jaipur",
      experience: {
        min: 1,
        max: 3,
        unit: "years",
      },
      skills: [
        "Senior Executive",
        "Invoice processing",
        "Debit note",
        "Processing",
        "Debit",
        "Invoicing",
        "Process",
        "Senior",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "The person should have a good understanding about the AP process (Invoice processing)",
      applyUrl:
        "https://www.naukri.com/job-listings-senior-executive-exl-services-com-i-pvt-ltd-jaipur-1-to-3-years-251025503207",
    },
    {
      id: "5",
      title: "Project Consultant - SaT - GOV - SaT - TCF",
      company: {
        name: "EY",
        logo: "https://img.naukimg.com/logo_images/groups/v1/243080.gif",
        rating: 3.4,
        reviewCount: 13174,
      },
      location: "Jaipur",
      experience: {
        min: 0,
        max: 5,
        unit: "years",
      },
      skills: [
        "Assurance",
        "Project finance",
        "Financial planning",
        "Agile",
        "Corporate finance",
        "Investment banking",
        "Operations",
        "Advisory",
      ],
      postedDate: "Just now",
      workMode: "Work from office",
      description:
        "Ensure compliance with policies while improving efficiency and outcomes",
      applyUrl:
        "https://www.naukri.com/job-listings-project-consultant-sat-gov-sat-tcf-ernst-young-jaipur-0-to-5-years-271025502783",
    },
    {
      id: "6",
      title: "Security Guard",
      company: {
        name: "G4S",
        logo: "https://img.naukimg.com/logo_images/groups/v1/356616.gif",
        rating: 4.0,
        reviewCount: 2531,
      },
      location: "Jaipur",
      experience: {
        min: 0,
        max: 1,
        unit: "years",
      },
      skills: [
        "Training",
        "Security systems",
        "Banking",
        "Security Guard",
        "Security services",
        "EPF",
        "CCTV",
        "Monitoring",
      ],
      postedDate: "5 days ago",
      workMode: "Work from office",
      description:
        "Shift: 12 hours. Minimum Height 5 feet and 7 inches (5'7\") for males",
      applyUrl:
        "https://www.naukri.com/job-listings-security-guard-g4s-corporate-services-india-pvt-ltd-jaipur-0-to-1-years-221025503700",
    },
    {
      id: "7",
      title: "Officer, Branch Relationship Manager",
      company: {
        name: "DBS Bank",
        logo: "https://img.naukimg.com/logo_images/groups/v1/429384.gif",
        rating: 3.8,
        reviewCount: 2391,
      },
      location: "Jaipur",
      experience: {
        min: 5,
        max: 10,
        unit: "years",
      },
      skills: [
        "Relationship management",
        "Due diligence",
        "Penetration",
        "Regulatory compliance",
        "consumer banking",
        "Customer service",
        "Sales process",
        "banking products",
      ],
      postedDate: "5 days ago",
      workMode: "Work from office",
      description:
        "Minimum 5 years of experience in a reputed bank and proficient in banking products",
      applyUrl:
        "https://www.naukri.com/job-listings-officer-branch-relationship-manager-dbs-bank-ltd-jaipur-5-to-10-years-221025503090",
    },
    {
      id: "8",
      title: "Automobile Technician (Rajasthan)",
      company: {
        name: "2coms",
        logo: "https://img.naukimg.com/logo_images/groups/v1/467982.gif",
        rating: 3.4,
        reviewCount: 469,
      },
      location: ["Jaipur", "Bikaner", "Jodhpur"],
      experience: {
        min: 0,
        max: 5,
        unit: "years",
      },
      salary: {
        min: 50000,
        max: 275000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "diesel",
        "repair",
        "simulink",
        "advisory services",
        "mechanical",
        "inventory",
        "powertrain",
        "catia",
      ],
      postedDate: "Few hours ago",
      workMode: "Work from office",
      description:
        "Only male candidate. Min qualification: 12th pass / diploma/ITI / graduation/post graduation",
      applyUrl:
        "https://www.naukri.com/job-listings-automobile-technician-rajasthan-2coms-jaipur-bikaner-jodhpur-0-to-5-years-271025015278",
    },
    {
      id: "9",
      title: "Asset Services (Corporate Actions & Income)",
      company: {
        name: "Deutsche Bank",
        logo: "https://img.naukimg.com/logo_images/groups/v1/468918.gif",
        rating: 3.9,
        reviewCount: 4158,
      },
      location: "Jaipur",
      experience: {
        min: 1,
        max: 4,
        unit: "years",
      },
      skills: [
        "microsoft office applications",
        "training",
        "corporate actions",
        "investment banking operations",
        "collections process",
        "transaction processing",
        "event management",
        "screening",
      ],
      postedDate: "1 week ago",
      workMode: "Work from office",
      description:
        "The process involves input, investigation, and correction where we have discrepancies",
      applyUrl:
        "https://www.naukri.com/job-listings-asset-services-corporate-actions-income-deutsche-bank-ag-jaipur-1-to-4-years-161025910569",
    },
    {
      id: "10",
      title: "Associate",
      company: {
        name: "Delhivery",
        logo: "https://img.naukimg.com/logo_images/groups/v1/509622.gif",
        rating: 3.8,
        reviewCount: 7273,
      },
      location: [
        "Jaipur",
        "Vapi",
        "Hyderabad",
        "Chennai",
        "Noida",
        "Kolkata",
        "Mumbai",
        "Indore",
        "Thane",
        "Bhiwandi",
        "Pune",
        "Ahmedabad",
        "Gurugram",
        "Bilaspur",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      skills: [
        "financial analysis",
        "risk management",
        "statutory compliance",
        "employee relations",
        "production",
        "regulatory compliance",
        "training",
        "auditing",
      ],
      postedDate: "3+ weeks ago",
      workMode: "Work from office",
      description:
        "Delhivery is looking for Associate to join our dynamic team and embark on a rewarding career",
      applyUrl:
        "https://www.naukri.com/job-listings-associate-delhivery-vapi-hyderabad-chennai-jaipur-noida-kolkata-mumbai-indore-thane-bhiwandi-pune-ahmedabad-gurugram-bilaspur-bengaluru-0-to-3-years-300425508342",
    },
    {
      id: "11",
      title: "Sales Intern",
      company: {
        name: "Muthoot Finance",
        logo: "https://img.naukimg.com/logo_images/groups/v1/589866.gif",
        rating: 3.6,
        reviewCount: 5884,
      },
      location: ["Jaipur", "Zirakpur", "Delhi / NCR"],
      experience: {
        min: 0,
        max: 0,
        unit: "years",
      },
      salary: {
        min: 100000,
        max: 150000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "Communication Skills",
        "Selling Skills",
        "Sales",
        "Cold Calling",
        "Good Convincing Skills",
        "Cold",
        "Selling",
        "Calling",
      ],
      postedDate: "1 week ago",
      workMode: "Work from office",
      badges: ["Walk-in"],
      description:
        "Roles and Responsibilities Assist sales team in generating leads through cold calling",
      applyUrl:
        "https://www.naukri.com/job-listings-sales-intern-muthoot-finance-zirakpur-jaipur-delhi-ncr-0-to-0-years-141025027103",
    },
    {
      id: "12",
      title: "Demand Manager",
      company: {
        name: "OYO",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1027760.gif",
        rating: 3.1,
        reviewCount: 3802,
      },
      location: "Jaipur",
      experience: {
        min: 2,
        max: 7,
        unit: "years",
      },
      salary: {
        min: 475000,
        max: 750000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "Field Sales",
        "B2B Sales",
        "Corporate Sales",
        "Corporate Selling",
        "Telecom Sales",
        "Channel Sales",
        "B2B Corporate Sales",
        "Enterprise Sales",
      ],
      postedDate: "4 days ago",
      workMode: "Work from office",
      description:
        "Location: Jaipur. Notice Period: Immediate to 15 Days Preferred Field Role (Mon-Sat Daily)",
      applyUrl:
        "https://www.naukri.com/job-listings-demand-manager-oyo-jaipur-2-to-7-years-100925042864",
    },
    {
      id: "13",
      title: "Service Manager",
      company: {
        name: "Pine Labs",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1081022.gif",
        rating: 3.3,
        reviewCount: 1599,
      },
      location: ["Jaipur", "Kochi", "Pune"],
      experience: {
        min: 1,
        max: 3,
        unit: "years",
      },
      skills: [
        "Service Engineering",
        "EDC installation",
        "PoS",
        "Merchant Acquiring",
        "Installation",
        "EDC",
        "Pos Machine",
        "Servicing",
      ],
      postedDate: "2 days ago",
      workMode: "Hybrid",
      description:
        "Qualification & Experience. Graduate in any stream. Various MIS report preparation for bank",
      applyUrl:
        "https://www.naukri.com/job-listings-service-manager-pine-labs-kochi-pune-jaipur-1-to-3-years-251025015185",
    },
    {
      id: "14",
      title: "Sales Manager - Jaipur",
      company: {
        name: "Swiggy",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1285014.gif",
        rating: 3.7,
        reviewCount: 5063,
      },
      location: "Jaipur",
      experience: {
        min: 1,
        max: 6,
        unit: "years",
      },
      skills: [
        "Sales",
        "B2B",
        "Key Accounts",
        "Sales management",
        "Management",
        "Accounting",
        "Key",
      ],
      postedDate: "Few hours ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Desired Candidate: Graduate with excellent communication skills. Should be a team player",
      applyUrl:
        "https://www.naukri.com/job-listings-sales-manager-jaipur-swiggy-jaipur-1-to-6-years-271025017342",
    },
    {
      id: "15",
      title: "Field Sales Executive",
      company: {
        name: "Cardekho.com",
        logo: "https://img.naukimg.com/logo_images/groups/v1/2266092.gif",
        rating: 3.6,
        reviewCount: 959,
      },
      location: ["Jaipur", "Lucknow", "Mumbai (All Areas)"],
      experience: {
        min: 1,
        max: 5,
        unit: "years",
      },
      salary: {
        min: 200000,
        max: 350000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "Property Sales",
        "Property Acquisition",
        "Real Estate Construction",
        "Real Estate Marketing",
        "Commercial Real Estate",
        "Real Estate",
        "Real Estate Sales",
        "Residential Sales",
      ],
      postedDate: "1 week ago",
      workMode: "Work from office",
      description:
        "Graduate in any stream 1+ year of experience in sales (real estate, NBFC, or similar field)",
      applyUrl:
        "https://www.naukri.com/job-listings-field-sales-executive-cardekho-com-lucknow-jaipur-mumbai-all-areas-1-to-5-years-161025011088",
    },
    {
      id: "16",
      title: "Urgent Hiring | Evaluation Engineer l Mumbai/Jaipur/Punjab.",
      company: {
        name: "Cars24",
        logo: "https://img.naukimg.com/logo_images/groups/v1/2519816.gif",
        rating: 3.5,
        reviewCount: 4253,
      },
      location: ["Jaipur", "Mumbai (All Areas)", "Punjab"],
      experience: {
        min: 1,
        max: 6,
        unit: "years",
      },
      salary: {
        min: 100000,
        max: 450000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "service advisor",
        "Automobile",
        "mechanic",
        "bodyshop advisor",
        "Evaluation",
        "Advisory Services",
        "Car Service",
        "Technical Evaluation",
      ],
      postedDate: "5 days ago",
      workMode: "Work from office",
      description:
        "Candidates with 1 to 7 years of experience in the automotive industry particularly in repair",
      applyUrl:
        "https://www.naukri.com/job-listings-urgent-hiring-evaluation-engineer-l-mumbai-jaipur-punjab-cars24-jaipur-mumbai-all-areas-punjab-1-to-6-years-221025010622",
    },
    {
      id: "17",
      title: "Customer Satisfaction Manager",
      company: {
        name: "DECATHLON Sports",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4589679.gif",
        rating: 3.7,
        reviewCount: 1193,
      },
      location: "Jaipur",
      experience: {
        min: 3,
        max: 6,
        unit: "years",
      },
      skills: [
        "Printing",
        "Data analysis",
        "human capital",
        "Social media",
        "commercial strategy",
        "Customer support",
        "Customer service",
        "Customer experience",
      ],
      postedDate: "5 days ago",
      workMode: "Work from office",
      description:
        "RESPONSIBILITY: I ensure to provide a best-in-class customer experience",
      applyUrl:
        "https://www.naukri.com/job-listings-customer-satisfaction-manager-decathlon-india-pvt-ltd-jaipur-3-to-6-years-221025503429",
    },
    {
      id: "18",
      title: "Retail Sales",
      company: {
        name: "Jaquar Group",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4604351.gif",
        rating: 4.1,
        reviewCount: 1330,
      },
      location: "Jaipur",
      experience: {
        min: 7,
        max: 12,
        unit: "years",
      },
      skills: [
        "Retail Channel Sales",
        "Channel Sales",
        "Channel",
        "Sales",
        "Retail sales",
        "Retail",
      ],
      postedDate: "Few hours ago",
      workMode: "Work from office",
      description:
        "Experience in working with dealers and channel partners. Strong product knowledge and training",
      applyUrl:
        "https://www.naukri.com/job-listings-retail-sales-jaquar-group-jaipur-7-to-12-years-271025016395",
    },
    {
      id: "19",
      title: "Hiring For Ecommerce - Email Process Work from Home - A",
      company: {
        name: "Hexaware Technologies",
        logo: "https://img.naukimg.com/logo_images/groups/v1/11819827.gif",
      },
      location: [
        "Jaipur",
        "Kolkata",
        "Hyderabad",
        "Pune",
        "Ahmedabad",
        "Chennai",
        "Bengaluru",
        "Delhi / NCR",
        "Mumbai (All Areas)",
      ],
      experience: {
        min: 0,
        max: 5,
        unit: "years",
      },
      salary: {
        min: 300000,
        max: 800000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "wfh",
        "BPO",
        "Blended Process",
        "Email Support",
        "a",
        "Customer Service",
        "International Call Center",
        "Voice Process",
      ],
      postedDate: "Just now",
      workMode: "Hybrid",
      description:
        "Work From Home opportunity. Process: Blended process (Chat or Email includes inbound)",
      applyUrl:
        "https://www.naukri.com/job-listings-hiring-for-ecommerce-email-process-work-from-home-a-hexaware-technologies-kolkata-hyderabad-pune-ahmedabad-chennai-jaipur-bengaluru-delhi-ncr-mumbai-all-areas-0-to-5-years-271025021289",
    },
    {
      id: "20",
      title: "Apprentice - Non Technology",
      company: {
        name: "Deutsche Bank",
        logo: "https://img.naukimg.com/logo_images/v3/1643970.gif",
        rating: 3.9,
        reviewCount: 4158,
      },
      location: ["Jaipur", "Mumbai"],
      experience: {
        min: 1,
        max: 2,
        unit: "years",
      },
      skills: [
        "Excel",
        "Publishing",
        "Anti money laundering",
        "Banking",
        "Manager Technology",
        "Power point presentation",
        "Customer service",
        "Training and Development",
      ],
      postedDate: "3+ weeks ago",
      workMode: "Work from office",
      description:
        "Bachelor Degree from an accredited college or university. Education/Qualifications",
      applyUrl:
        "https://www.naukri.com/job-listings-apprentice-non-technology-deutsche-bank-mumbai-jaipur-1-to-2-years-220725503902",
    },
    {
      id: "21",
      title: "Fresher",
      company: {
        name: "Unifybrains Infotech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4965744.gif",
      },
      location: [
        "New Delhi",
        "Kolkata",
        "Mumbai",
        "Hyderabad",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 2,
        unit: "years",
      },
      skills: ["ios trainee", "Training", "IOS", "Io"],
      postedDate: "3+ weeks ago",
      workMode: "Work from office",
      description: "Should have knowledge of C, C++",
      applyUrl:
        "https://www.naukri.com/job-listings-fresher-unifybrains-infotech-pvt-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-2-years-200520500046",
    },
    {
      id: "22",
      title: "Associate Software Engineer",
      company: {
        name: "HGS Ltd.",
        logo: "https://img.naukimg.com/logo_images/groups/v1/233848.gif",
        rating: 3.8,
        reviewCount: 7316,
      },
      location: [
        "New Delhi",
        "Kolkata",
        "Mumbai",
        "Hyderabad",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 2,
        unit: "years",
      },
      skills: [
        "query studio",
        "performance tuning",
        "version control",
        "bi",
        "unit testing",
        "data warehousing",
        "framework manager",
        "cognos",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Bachelors degree in Computer Science, Information Systems, or a related field, Knowledge...",
      applyUrl:
        "https://www.naukri.com/job-listings-associate-software-engineer-hgs-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-2-years-190925503555",
    },
    {
      id: "23",
      title: "HR Intern",
      company: {
        name: "Patanjali Foods Limited",
        logo: "https://img.naukimg.com/logo_images/groups/v1/7966517.gif",
        rating: 3.8,
        reviewCount: 1396,
      },
      location: [
        "New Delhi",
        "Kolkata",
        "Mumbai",
        "Hyderabad",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 1,
        unit: "years",
      },
      skills: [
        "screening",
        "hiring",
        "employee training",
        "resource",
        "documentation",
        "hr compliance",
        "hr operations",
        "employee engagement",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Job Type: Full Time. This internship is perfect for someone looking to build practical HR...",
      applyUrl:
        "https://www.naukri.com/job-listings-hr-intern-patanjali-foods-limited-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-1-years-190925503969",
    },
    {
      id: "24",
      title:
        "Woman Sales Professional /Medical Representative - General Segment",
      company: {
        name: "Cipla",
        logo: "https://img.naukimg.com/logo_images/groups/v1/20810.gif",
        rating: 4.1,
        reviewCount: 7758,
      },
      location: ["Delhi / NCR", "Ahmedabad", "Mumbai (All Areas)"],
      experience: {
        min: 0,
        max: 5,
        unit: "years",
      },
      skills: [
        "Medical Rep",
        "Field Sales",
        "Sales Execution",
        "Pharmaceutical Sales",
        "Sales",
        "Medical Sales",
        "MR",
        "Trade Marketing",
      ],
      postedDate: "2 days ago",
      workMode: "Work from office",
      badges: ["For women"],
      description:
        "Fresher from any background who willing to start their career in pharma sales Preferred...",
      applyUrl:
        "https://www.naukri.com/job-listings-woman-sales-professional-medical-representative-general-segment-cipla-ahmedabad-delhi-ncr-mumbai-all-areas-0-to-5-years-220525020406",
    },
    {
      id: "25",
      title: "Project Manager",
      company: {
        name: "Capgemini",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1288.gif",
        rating: 3.7,
        reviewCount: 48407,
      },
      location: ["Gurugram", "Bengaluru", "Mumbai (All Areas)"],
      experience: {
        min: 7,
        max: 12,
        unit: "years",
      },
      skills: [
        "Project Management",
        "Rollout",
        "Project Coordination",
        "Customer Engagement",
        "Implementation Cycle",
        "Stakeholder Management",
        "Project",
        "Engagement",
      ],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "We have an urgent requirement for Project Manager for Mumbai, Bangalore, Gurgaon location...",
      applyUrl:
        "https://www.naukri.com/job-listings-project-manager-capgemini-gurugram-bengaluru-mumbai-all-areas-7-to-12-years-190925030879",
    },
    {
      id: "26",
      title: "Relationship Associate Bancassurance",
      company: {
        name: "Axis Max Life Insurance Limited",
        logo: "https://img.naukimg.com/logo_images/groups/v1/11762943.gif",
        rating: 4.0,
        reviewCount: 6387,
      },
      location: [
        "New Delhi",
        "Kolkata",
        "Mumbai",
        "Hyderabad",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      skills: [
        "Relationship Associate Bancassurance",
        "Bancassurance",
        "Relationship",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Job Specifications: Graduate in Any Discipline from a UGC / AICTE approved College and...",
      applyUrl:
        "https://www.naukri.com/job-listings-relationship-associate-bancassurance-axis-max-life-insurance-limited-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-3-years-190925503388",
    },
    {
      id: "27",
      title: "Key Account Manager-IC",
      company: {
        name: "Paytm",
        logo: "https://img.naukimg.com/logo_images/groups/v1/144830.gif",
        rating: 3.2,
        reviewCount: 8472,
      },
      location: ["Delhi / NCR", "Bengaluru", "Mumbai (All Areas)"],
      experience: {
        min: 6,
        max: 11,
        unit: "years",
      },
      salary: {
        min: 1200000,
        max: 1800000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "Enterprise Sales / Key Account Management in Payments",
        "Fintech",
        "or BFSI.",
        "Bfsi",
        "Payments",
        "Accounting",
        "Key account management",
        "Key",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Title: Key Account Manager | Enterprise & Growth Portfolio. About Paytm Group: Paytm is I...",
      applyUrl:
        "https://www.naukri.com/job-listings-key-account-manager-ic-paytm-bengaluru-delhi-ncr-mumbai-all-areas-6-to-11-years-190925017078",
    },
    {
      id: "28",
      title: "Relationship Associate Bancassurance",
      company: {
        name: "Axis Max Life Insurance Limited",
        logo: "https://img.naukimg.com/logo_images/groups/v1/11762943.gif",
        rating: 4.0,
        reviewCount: 6387,
      },
      location: [
        "New Delhi",
        "Kolkata",
        "Mumbai",
        "Hyderabad",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      skills: [
        "insurance",
        "rhino",
        "jsp",
        "cad",
        "mql",
        "business development",
        "business planning",
        "matrix",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Job Specifications: Graduate in Any Discipline from a UGC / AICTE approved College and...",
      applyUrl:
        "https://www.naukri.com/job-listings-relationship-associate-bancassurance-axis-max-life-insurance-limited-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-3-years-190925503619",
    },
    {
      id: "29",
      title: "Data Platform Engineer",
      company: {
        name: "Hdfc Bank",
        logo: "https://img.naukimg.com/logo_images/groups/v1/67548.gif",
        rating: 3.8,
        reviewCount: 46109,
      },
      location: ["Noida", "Navi Mumbai", "Bengaluru"],
      experience: {
        min: 3,
        max: 7,
        unit: "years",
      },
      skills: [
        "Azure",
        "Terraform",
        "Kubernetes",
        "Azure Data Factory",
        "Ansible",
        "Platform Engineer",
        "Azure Databricks",
        "Ci/Cd",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Experienced technology engineer with a minimum of 3+ years of data tools implementation...",
      applyUrl:
        "https://www.naukri.com/job-listings-data-platform-engineer-hdfc-bank-noida-navi-mumbai-bengaluru-3-to-7-years-190925020389",
    },
    {
      id: "30",
      title: "Statistical Programmer",
      company: {
        name: "Tata Consultancy Services",
        logo: "https://img.naukimg.com/logo_images/groups/v1/223346.gif",
        rating: 3.5,
        reviewCount: 103816,
      },
      location: ["Delhi / NCR", "Pune", "Mumbai (All Areas)"],
      experience: {
        min: 7,
        max: 12,
        unit: "years",
      },
      skills: [
        "Adam",
        "Cdisc",
        "TFL",
        "Sdtm",
        "Adams",
        "Statistical programming",
        "Statistics",
        "Program",
      ],
      postedDate: "3 days ago",
      workMode: "Work from office",
      description:
        "Experience Range 5 to 12 Years. Skillset Required SDTM, ADAM, TFL. Experience in the...",
      applyUrl:
        "https://www.naukri.com/job-listings-statistical-programmer-tata-consultancy-services-pune-delhi-ncr-mumbai-all-areas-7-to-12-years-160925023343",
    },
    {
      id: "31",
      title: "Oracle Fusion SCM Functional Lead",
      company: {
        name: "Oracle",
        logo: "https://img.naukimg.com/logo_images/groups/v1/18850.gif",
        rating: 3.6,
        reviewCount: 5862,
      },
      location: [
        "Delhi / NCR",
        "Kolkata",
        "Mumbai",
        "Gandhinagar",
        "Hyderabad/Secunderabad",
        "Pune",
        "Chennai",
        "Bangalore/Bengaluru",
        "Thiruvananthapuram",
      ],
      experience: {
        min: 8,
        max: 13,
        unit: "years",
      },
      salary: {
        min: 1800000,
        max: 3300000,
        currency: "INR",
        period: "Per Annum (Including Variable: 15.0%)",
      },
      skills: [
        "Fusion Scm",
        "Scm Cloud",
        "MFG",
        "Order To Cash",
        "Planning",
        "OM",
        "Functional",
        "Oracle Fusion SCM",
      ],
      postedDate: "4 days ago",
      workMode: "Hybrid",
      description:
        "Bachelor of Engineering or master's degree in business administration (MBA) with 5 to 1...",
      applyUrl:
        "https://www.naukri.com/job-listings-oracle-fusion-scm-functional-lead-oracle-kolkata-mumbai-gandhinagar-hyderabad-secunderabad-pune-chennai-bangalore-bengaluru-delhi-ncr-thiruvananthapuram-8-to-13-years-270723006137",
    },
    {
      id: "32",
      title: "Partnerships Intern SFC India",
      company: {
        name: "Smart Freight Centre",
        logo: "https://img.naukimg.com/logo_images/groups/v1/10508046.gif",
      },
      location: [
        "New Delhi",
        "Kolkata",
        "Mumbai",
        "Hyderabad",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 1,
        unit: "years",
      },
      skills: [
        "hlookup",
        "charts",
        "conditional formatting",
        "vlookup",
        "dashboards",
        "research",
        "advanced excel",
        "mis",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Are you passionate about reducing the climate impacts originating from multiple industries...",
      applyUrl:
        "https://www.naukri.com/job-listings-partnerships-intern-sfc-india-smart-freight-centre-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-1-years-190925503446",
    },
    {
      id: "33",
      title: "SAP MM Technical Consultant - Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 44589,
      },
      location: ["Delhi / NCR", "Pune", "Mumbai (All Areas)"],
      experience: {
        min: 9,
        max: 14,
        unit: "years",
      },
      skills: [
        "SAP MM",
        "SAP MM Module",
        "SAP MM Implementation",
        "MM",
        "Consulting",
        "SAP",
        "Mm module",
        "Technical",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Hiring for SAP MM Technical Consultant with experience range 1 to 18 Years. Mandatory Sk...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-mm-technical-consultant-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-9-to-14-years-180925026651",
    },
    {
      id: "34",
      title:
        "GN - Tech Strategy & Advisory - Artificial intelligence - Manager",
      company: {
        name: "Accenture",
        logo: "https://img.naukimg.com/logo_images/groups/v1/10476.gif",
        rating: 3.7,
        reviewCount: 66382,
      },
      location: ["Mumbai", "Gurugram", "Bengaluru"],
      experience: {
        min: 10,
        max: 15,
        unit: "years",
      },
      skills: [
        "Artificial intelligence",
        "practice development",
        "Cloud",
        "NLP algo",
        "machine learning",
        "Data Preparation",
        "Feature engineering",
        "Engineering",
      ],
      postedDate: "2 days ago",
      workMode: "Work from office",
      description:
        "Practice Overview: Skill/Operating Group Technology Consulting Level Manager Location G...",
      applyUrl:
        "https://www.naukri.com/job-listings-gn-tech-strategy-advisory-artificial-intelligence-manager-accenture-solutions-pvt-ltd-mumbai-gurugram-bengaluru-10-to-15-years-170925934534",
    },
    {
      id: "35",
      title: "GN - Strategy - MC - SC&O - SC Digital Core S4 japan- analyst",
      company: {
        name: "Accenture",
        logo: "https://img.naukimg.com/logo_images/groups/v1/10476.gif",
        rating: 3.7,
        reviewCount: 66382,
      },
      location: ["Mumbai", "Gurugram", "Bengaluru"],
      experience: {
        min: 1,
        max: 4,
        unit: "years",
      },
      skills: [
        "Supply Chain Operations",
        "sap s hana",
        "data analysis",
        "supply chain management",
        "business modeling",
        "logistics",
        "business analysis",
        "ewm",
      ],
      postedDate: "2 days ago",
      workMode: "Work from office",
      description:
        "Bachelors degree in Engineering with good academic record MBA / Masters degree in Supply...",
      applyUrl:
        "https://www.naukri.com/job-listings-gn-strategy-mc-sc-o-sc-digital-core-s4-japan-analyst-accenture-solutions-pvt-ltd-mumbai-gurugram-bengaluru-1-to-4-years-170925934509",
    },
    {
      id: "36",
      title: "Python + AWS Data Engineer",
      company: {
        name: "Citiustech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/682834.gif",
        rating: 3.2,
        reviewCount: 1856,
      },
      location: ["Hyderabad", "Gurugram", "Mumbai (All Areas)"],
      experience: {
        min: 5,
        max: 10,
        unit: "years",
      },
      skills: ["Power BI", "FHIR", "AWS", "Python", "SQL", "Data", "Bi"],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "Secondary Skill - Experience in healthcare data systems. Experience - 5 years - 8 years...",
      applyUrl:
        "https://www.naukri.com/job-listings-python-aws-data-engineer-citiustech-hyderabad-gurugram-mumbai-all-areas-5-to-10-years-190925017651",
    },
    {
      id: "37",
      title: "Sap Fico Technical Consultant -Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 44589,
      },
      location: ["Delhi / NCR", "Pune", "Mumbai (All Areas)"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      skills: [
        "SAP FICO Technical Consultant",
        "SAP FICO",
        "FICO",
        "Consulting",
        "SAP",
        "Technical",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Hiring for SAP FICO Technical Consultant with experience range 1 to 18 Years. Mandatory...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-fico-technical-consultant-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-4-to-9-years-180925022716",
    },
    {
      id: "38",
      title: "Sap ABAP Technical Consultant- Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 44589,
      },
      location: ["Delhi / NCR", "Pune", "Mumbai (All Areas)"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      skills: [
        "SAP ABAP Technical Consultant",
        "Sap Abap Hana",
        "SAP ABAP",
        "Abap",
        "Technical",
        "Abap On Hana",
        "SAP",
        "Ax Technical",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Hiring for SAP ABAP Technical Consultant with experience range 1 to 18 Years. Mandatory...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-abap-technical-consultant-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-4-to-9-years-180925022200",
    },
    {
      id: "39",
      title: "SAP Security Technical Consultant - Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 44589,
      },
      location: ["Delhi / NCR", "Pune", "Mumbai (All Areas)"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      skills: [
        "SAP Security Technical Consultant",
        "SAP Security",
        "Hana Security",
        "Technical",
        "SAP",
        "Consulting",
        "SAP Hana",
        "Saps",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Hiring for SAP Security Technical Consultant with experience range 1 to 18 Years. Mandatory...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-security-technical-consultant-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-4-to-9-years-180925023830",
    },
    {
      id: "40",
      title: "Sap SD Technical Consultant - Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 44589,
      },
      location: ["Delhi / NCR", "Pune", "Mumbai (All Areas)"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      skills: [
        "SAP SD Technical Consultant",
        "SAP SD",
        "SD Module",
        "Consulting",
        "Saps",
        "SAP",
        "Technical",
        "SD",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Hiring for SAP SD Technical Consultant with experience range 1 to 18 Years. Mandatory Sk...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-sd-technical-consultant-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-4-to-9-years-180925023534",
    },
    {
      id: "41",
      title: "Field Service Engineer",
      company: {
        name: "Randstad",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1422.gif",
      },
      location: "Hyderabad",
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      skills: [
        "Hplc",
        "Analytical Instruments",
        "service engineer",
        "Fsa",
        "lc",
        "Instrumentation",
        "Gas Chromatography",
        "Field Service Engineering",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "This role requires a minimum of 0 years and a maximum of 3 years of experience in the P...",
      applyUrl:
        "https://www.naukri.com/job-listings-field-service-engineer-randstad-hyderabad-0-to-3-years-180925023391",
    },
    {
      id: "42",
      title: "Automation testing - Infosys Pune /Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 44589,
      },
      location: ["Hyderabad", "Pune", "Bengaluru"],
      experience: {
        min: 3,
        max: 5,
        unit: "years",
      },
      skills: [
        "Automation Testing",
        "Selenium Automation",
        "Java Selenium",
        "Java",
        "Automation",
        "Software testing",
        "Selenium",
      ],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      badges: ["For women"],
      description:
        "and build POCs You will create requirement specifications from the business needs, defi...",
      applyUrl:
        "https://www.naukri.com/job-listings-automation-testing-infosys-pune-bangalore-infosys-hyderabad-pune-bengaluru-3-to-5-years-110825013921",
    },
    {
      id: "43",
      title: "Servicenow Developer",
      company: {
        name: "Tata Consultancy Services",
        logo: "https://img.naukimg.com/logo_images/groups/v1/223346.gif",
        rating: 3.5,
        reviewCount: 103816,
      },
      location: ["Hyderabad", "Mumbai (All Areas)"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      skills: ["Servicenow", "Servicenow Development", "ITSM", "Development"],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Greetings!! TCS Virtual Drive for ServiceNow Developer. Job Title: ServiceNow Developer. Loc...",
      applyUrl:
        "https://www.naukri.com/job-listings-servicenow-developer-tata-consultancy-services-hyderabad-mumbai-all-areas-4-to-9-years-180925027576",
    },
    {
      id: "44",
      title: "Senior Advisor Human Resources",
      company: {
        name: "Petrofac",
        logo: "https://img.naukimg.com/logo_images/groups/v1/290316.gif",
        rating: 4.2,
        reviewCount: 924,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 8,
        max: 13,
        unit: "years",
      },
      skills: [
        "shared services",
        "orientation",
        "human capital",
        "hr generalist activities",
        "employment law",
        "resource",
        "training needs",
        "excel",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Petrofac is currently looking to recruit a Senior Advisor Human Resource based in Chennai...",
      applyUrl:
        "https://www.naukri.com/job-listings-senior-advisor-human-resources-petrofac-engineering-services-india-pvt-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-8-to-13-years-190925503785",
    },
    {
      id: "45",
      title: "GL Accountant",
      company: {
        name: "CBRE",
        logo: "https://img.naukimg.com/logo_images/groups/v1/671658.gif",
        rating: 4.1,
        reviewCount: 4655,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 2,
        max: 5,
        unit: "years",
      },
      skills: [
        "ledger",
        "general ledger accounting",
        "balance sheet",
        "gl",
        "journal entries",
        "accounting",
        "balance sheet reconciliation",
        "gl accounting",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Bachelors Degree preferred with up to 3 years of relevant experience. Accordingly, invest...",
      applyUrl:
        "https://www.naukri.com/job-listings-gl-accountant-cbre-south-asia-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-2-to-5-years-190925503525",
    },
    {
      id: "46",
      title: "Python + AWS Data Engineer",
      company: {
        name: "Citiustech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/682834.gif",
        rating: 3.2,
        reviewCount: 1856,
      },
      location: ["Hyderabad", "Gurugram", "Mumbai (All Areas)"],
      experience: {
        min: 5,
        max: 10,
        unit: "years",
      },
      skills: ["Power BI", "FHIR", "AWS", "Python", "SQL", "Data", "Bi"],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "Secondary Skill - Experience in healthcare data systems. Experience - 5 years - 8 years...",
      applyUrl:
        "https://www.naukri.com/job-listings-python-aws-data-engineer-citiustech-hyderabad-gurugram-mumbai-all-areas-5-to-10-years-190925017651",
    },
    {
      id: "47",
      title: "Sap Ehs Consultant",
      company: {
        name: "NTT DATA Business Solutions",
        logo: "https://img.naukimg.com/logo_images/groups/v1/709704.gif",
        rating: 3.9,
        reviewCount: 1455,
      },
      location: ["Hyderabad", "Mumbai", "Bengaluru"],
      experience: {
        min: 9,
        max: 12,
        unit: "years",
      },
      skills: [
        "sap",
        "Environment Health Safety",
        "SAP EHS",
        "Environment",
        "EHS",
        "Consulting",
        "Safety",
        "Health",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Data collection, calculations, handle deviations and data reporting. Good to have expos...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-ehs-consultant-ntt-data-business-solutions-mumbai-hyderabad-bengaluru-9-to-12-years-190925023864",
    },
    {
      id: "48",
      title: "Associate Consultant- Product Owner (Credit Collections or LOS)",
      company: {
        name: "CGI",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1402790.gif",
        rating: 4.0,
        reviewCount: 5250,
      },
      location: ["Hyderabad", "Bengaluru", "Mumbai (All Areas)"],
      experience: {
        min: 7,
        max: 12,
        unit: "years",
      },
      salary: {
        min: 1500000,
        max: 2500000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "LOS",
        "Product owner",
        "Digital Lending",
        "Credit Collection",
        "Consulting",
        "Credit",
        "Collections",
        "Digital",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "J0725-0465 Lead Business Analyst/ Associate Consultant- Product Owner - Credit Collect...",
      applyUrl:
        "https://www.naukri.com/job-listings-associate-consultant-product-owner-credit-collections-or-los-cgi-hyderabad-bengaluru-mumbai-all-areas-7-to-12-years-120925015294",
    },
    {
      id: "49",
      title: "PM - Transaction Banking Professional",
      company: {
        name: "Capco",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4586641.gif",
        rating: 3.7,
        reviewCount: 602,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 8,
        max: 13,
        unit: "years",
      },
      skills: [
        "Escalation management",
        "SEPA",
        "Project management",
        "Analytical",
        "Management consulting",
        "Agile",
        "JIRA",
        "Stakeholder management",
      ],
      postedDate: "3+ weeks ago",
      workMode: "Work from office",
      description:
        "Awarded with Consultancy of the year in the British Bank Award and has been ranked Top...",
      applyUrl:
        "https://www.naukri.com/job-listings-pm-transaction-banking-professional-capco-technologies-pvt-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-8-to-13-years-150725502608",
    },
    {
      id: "50",
      title: "Document Controller",
      company: {
        name: "Jacobs",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4604773.gif",
        rating: 4.1,
        reviewCount: 1039,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 3,
        max: 7,
        unit: "years",
      },
      skills: [
        "document management system",
        "project documentation",
        "administration",
        "document management",
        "documentation",
        "document control",
        "sharepoint",
        "edms",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Minimum five (5) years work experience, with minimum two (2) years work experience in do...",
      applyUrl:
        "https://www.naukri.com/job-listings-document-controller-jacobs-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-3-to-7-years-190925503929",
    },
    {
      id: "51",
      title: "Automated Tester API Automation, Basic Java - BLR",
      company: {
        name: "Photon",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4619011.gif",
        rating: 4.1,
        reviewCount: 2165,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 6,
        max: 9,
        unit: "years",
      },
      skills: [
        "Automation",
        "Interpersonal skills",
        "Manager Quality Assurance",
        "Web services",
        "Coding",
        "Cics",
        "Agile methodology",
        "Selenium",
      ],
      postedDate: "1 week ago",
      workMode: "Work from office",
      description:
        "A strong ability to build and maintain good working relationships with partners is esse...",
      applyUrl:
        "https://www.naukri.com/job-listings-automated-tester-api-automation-basic-java-blr-photon-infotech-p-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-6-to-9-years-090925500513",
    },
    {
      id: "52",
      title: "Fresher",
      company: {
        name: "Unifybrains Infotech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/4965744.gif",
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 2,
        unit: "years",
      },
      skills: ["ios trainee", "Training", "IOS", "Io"],
      postedDate: "3+ weeks ago",
      workMode: "Work from office",
      description: "Should have knowledge of C, C++",
      applyUrl:
        "https://www.naukri.com/job-listings-fresher-unifybrains-infotech-pvt-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-2-years-200520500046",
    },
    {
      id: "53",
      title: "HR Intern",
      company: {
        name: "Patanjali Foods Limited",
        logo: "https://img.naukimg.com/logo_images/groups/v1/7966517.gif",
        rating: 3.8,
        reviewCount: 1396,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 1,
        unit: "years",
      },
      skills: [
        "screening",
        "hiring",
        "employee training",
        "resource",
        "documentation",
        "hr compliance",
        "hr operations",
        "employee engagement",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Job Type: Full Time. This internship is perfect for someone looking to build practical HR...",
      applyUrl:
        "https://www.naukri.com/job-listings-hr-intern-patanjali-foods-limited-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-1-years-190925503969",
    },
    {
      id: "54",
      title: "Partnerships Intern SFC India",
      company: {
        name: "Smart Freight Centre",
        logo: "https://img.naukimg.com/logo_images/groups/v1/10508046.gif",
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 1,
        unit: "years",
      },
      skills: [
        "hlookup",
        "charts",
        "conditional formatting",
        "vlookup",
        "dashboards",
        "research",
        "advanced excel",
        "mis",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Are you passionate about reducing the climate impacts originating from multiple industries...",
      applyUrl:
        "https://www.naukri.com/job-listings-partnerships-intern-sfc-india-smart-freight-centre-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-1-years-190925503446",
    },
    {
      id: "55",
      title: "Associate Software Engineer",
      company: {
        name: "HGS Ltd.",
        logo: "https://img.naukimg.com/logo_images/groups/v1/233848.gif",
        rating: 3.8,
        reviewCount: 7316,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 2,
        unit: "years",
      },
      skills: [
        "query studio",
        "performance tuning",
        "version control",
        "bi",
        "unit testing",
        "data warehousing",
        "framework manager",
        "cognos",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Bachelors degree in Computer Science, Information Systems, or a related field, Knowledge...",
      applyUrl:
        "https://www.naukri.com/job-listings-associate-software-engineer-hgs-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-2-years-190925503555",
    },
    {
      id: "56",
      title: "RTR Analyst",
      company: {
        name: "CBRE",
        logo: "https://img.naukimg.com/logo_images/groups/v1/671658.gif",
        rating: 4.1,
        reviewCount: 4655,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 2,
        max: 5,
        unit: "years",
      },
      skills: [
        "accounts receivable",
        "balance sheet",
        "business services",
        "investment",
        "accounting",
        "general ledger",
        "cash applications",
        "research",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Accordingly, investors should monitor such portion of our website, in addition to following...",
      applyUrl:
        "https://www.naukri.com/job-listings-rtr-analyst-cbre-south-asia-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-2-to-5-years-190925503691",
    },
    {
      id: "57",
      title: "GL Accountant Sr",
      company: {
        name: "CBRE",
        logo: "https://img.naukimg.com/logo_images/groups/v1/671658.gif",
        rating: 4.1,
        reviewCount: 4655,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 3,
        max: 7,
        unit: "years",
      },
      skills: [
        "ledger",
        "general ledger accounting",
        "balance sheet",
        "gl",
        "journal entries",
        "accounting",
        "balance sheet reconciliation",
        "general ledger",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Bachelors Degree preferred with 2-5 years of relevant experience. Accordingly, investors...",
      applyUrl:
        "https://www.naukri.com/job-listings-gl-accountant-sr-cbre-south-asia-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-3-to-7-years-190925503484",
    },
    {
      id: "58",
      title: "General Practitioner",
      company: {
        name: "Practice Plus Group",
        logo: "https://img.naukimg.com/logo_images/groups/v1/10135812.gif",
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 4,
        max: 7,
        unit: "years",
      },
      skills: [
        "bpo",
        "freelancing",
        "computer operating",
        "bac",
        "back office",
        "medicine",
        "hrsd",
        "general medicine",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "This positions are part time, you'll receive an annual salary between ₹110,775 and ₹120...",
      applyUrl:
        "https://www.naukri.com/job-listings-general-practitioner-practice-plus-group-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-4-to-7-years-190925503772",
    },
    {
      id: "59",
      title: "Relationship Associate Bancassurance",
      company: {
        name: "Axis Max Life Insurance Limited",
        logo: "https://img.naukimg.com/logo_images/groups/v1/11762943.gif",
        rating: 4.0,
        reviewCount: 6387,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      skills: [
        "Relationship Associate Bancassurance",
        "Bancassurance",
        "Relationship",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "Job Specifications: Graduate in Any Discipline from a UGC / AICTE approved College and...",
      applyUrl:
        "https://www.naukri.com/job-listings-relationship-associate-bancassurance-axis-max-life-insurance-limited-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-3-years-190925503388",
    },
    {
      id: "60",
      title: "Senior Analyst Global WFM",
      company: {
        name: "HGS Ltd.",
        logo: "https://img.naukimg.com/logo_images/groups/v1/233848.gif",
        rating: 3.8,
        reviewCount: 7316,
      },
      location: [
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "New Delhi",
        "Pune",
        "Chennai",
        "Bengaluru",
      ],
      experience: {
        min: 2,
        max: 5,
        unit: "years",
      },
      skills: [
        "project management",
        "forecasting",
        "business analysis",
        "workforce management",
        "verint",
        "staffing",
        "sql",
        "excel",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      description:
        "1-3 years of experience in WFM real-time monitoring or contact center operations, Any gr...",
      applyUrl:
        "https://www.naukri.com/job-listings-senior-analyst-global-wfm-hgs-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-2-to-5-years-190925503790",
    },
    {
      id: "61",
      title:
        "Hiring - International voice exp - Bangalore/ Pune - Night shifts",
      company: {
        name: "Trigent software",
        logo: "https://img.naukimg.com/logo_images/groups/v1/125596.gif",
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 1,
        max: 5,
        unit: "years",
      },
      salary: {
        min: 300000,
        max: 600000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "Blended Process",
        "Domestic Voice Process",
        "Voice Process",
        "Inbound Process",
        "Email Support",
        "Customer Support",
        "Bpo Customer Service",
        "Bpo Voice",
      ],
      postedDate: "Few hours ago",
      workMode: "Work from office",
      description:
        "Adhere to Client defined as well as internally defined processes and procedures while...",
      applyUrl:
        "https://www.naukri.com/job-listings-hiring-international-voice-exp-bangalore-pune-night-shifts-trigent-software-pune-bengaluru-mumbai-all-areas-1-to-5-years-210625011374",
    },
    {
      id: "62",
      title:
        "Hiring - NON IT recruiter - Bangalore/ Pune/ Mumbai - Immediate joiner",
      company: {
        name: "Trigent software",
        logo: "https://img.naukimg.com/logo_images/groups/v1/125596.gif",
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 2,
        max: 4,
        unit: "years",
      },
      salary: {
        min: 100000,
        max: 475000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "BPO Hiring",
        "Non IT Recruitment",
        "Bulk Hiring",
        "Lateral Hiring",
        "Volume Hiring",
        "Non Technical Recruitment",
        "Bfsi Recruitment",
        "Campus Hiring",
      ],
      postedDate: "Today",
      workMode: "Work from office",
      description:
        "Assess applicants relevant knowledge, skills, soft skills, experience and aptitudes",
      applyUrl:
        "https://www.naukri.com/job-listings-hiring-non-it-recruiter-bangalore-pune-mumbai-immediate-joiner-trigent-software-pune-bengaluru-mumbai-all-areas-2-to-4-years-091025039203",
    },
    {
      id: "63",
      title: "React JS Developer",
      company: {
        name: "Deloitte Consulting",
        logo: "https://img.naukimg.com/logo_images/groups/v1/224154.gif",
        rating: 3.7,
        reviewCount: 21464,
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      salary: {
        min: 700000,
        max: 1700000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: ["Ui/Ux", "GIT", "Redux", "React.Js", "Azure Devops", "Nextjs"],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "Experience in BFSI domain or enterprise-grade web applications. Location Pune, Mumbai, Ba...",
      applyUrl:
        "https://www.naukri.com/job-listings-react-js-developer-deloitte-consulting-pune-bengaluru-mumbai-all-areas-4-to-9-years-281025036682",
    },
    {
      id: "64",
      title: "Back End Developer",
      company: {
        name: "Hdfc Bank",
        logo: "https://img.naukimg.com/logo_images/groups/v1/67548.gif",
        rating: 3.8,
        reviewCount: 48160,
      },
      location: ["Navi Mumbai", "Pune", "Bengaluru"],
      experience: {
        min: 6,
        max: 9,
        unit: "years",
      },
      skills: [
        "java",
        "Cloud",
        "Spring Boot",
        "Microservices",
        "Kubernetes",
        "Kafka",
        "Spring",
        "End",
      ],
      postedDate: "5 days ago",
      workMode: "Work from office",
      description:
        "Experience in implementing in service mesh infrastructure layer. Job Responsibilities:...",
      applyUrl:
        "https://www.naukri.com/job-listings-back-end-developer-hdfc-bank-navi-mumbai-pune-bengaluru-6-to-9-years-241025023192",
    },
    {
      id: "65",
      title: "LI SME",
      company: {
        name: "Teleperformance (TP)",
        logo: "https://img.naukimg.com/logo_images/groups/v1/215164.gif",
        rating: 3.8,
        reviewCount: 35099,
      },
      location: ["Mumbai (All Areas)", "Ahmedabad", "Bengaluru(Whitefield)"],
      experience: {
        min: 0,
        max: 3,
        unit: "years",
      },
      salary: {
        min: 275000,
        max: 300000,
        currency: "INR",
        period: "Per Annum",
      },
      skills: [
        "Life Insurance",
        "Mutual Funds",
        "Telesales",
        "Insurance Sales",
        "Voice Process",
        "Banking Sales",
        "insur",
        "Customer Relationship",
      ],
      postedDate: "2 days ago",
      workMode: "Work from office",
      badges: ["Walk-in"],
      description:
        "Ability to achieve sales targets and deliver high conversion rates. Graduation (any s...",
      applyUrl:
        "https://www.naukri.com/job-listings-li-sme-teleperformance-tp-ahmedabad-bengaluru-mumbai-all-areas-0-to-3-years-271025023284",
    },
    {
      id: "66",
      title: "Accounts Manager - Transaction Banking",
      company: {
        name: "ICICI Bank",
        logo: "https://img.naukimg.com/logo_images/groups/v1/44512.gif",
        rating: 4.0,
        reviewCount: 43784,
      },
      location: ["Mumbai", "Hyderabad", "Pune"],
      experience: {
        min: 3,
        max: 6,
        unit: "years",
      },
      skills: [
        "Transaction Banking",
        "Lending",
        "relationship management",
        "Sourcing",
        "Trade Finance",
        "Customer service",
        "Relationship",
        "Management",
      ],
      postedDate: "2 days ago",
      workMode: "Work from office",
      description:
        "MBA, Chartered Accountants, Engineers & Graduates with relevant work experience in Trad...",
      applyUrl:
        "https://www.naukri.com/job-listings-accounts-manager-transaction-banking-icici-bank-ltd-mumbai-hyderabad-pune-3-to-6-years-281025922373",
    },
    {
      id: "67",
      title: "SAP MM -Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 45669,
      },
      location: ["Mumbai (All Areas)", "Pune", "Delhi / NCR"],
      experience: {
        min: 1,
        max: 6,
        unit: "years",
      },
      skills: ["SAP MM", "Mm Module", "SAP MM Module", "SAP", "MM"],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Minimum Qualifications: BTech, MTech, BCA, BSC, MCA, MSC or equivalent educational ba...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-mm-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-1-to-6-years-101025029048",
    },
    {
      id: "68",
      title: "Business Analyst",
      company: {
        name: "Citiustech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/682834.gif",
        rating: 3.2,
        reviewCount: 1913,
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 5,
        max: 8,
        unit: "years",
      },
      skills: [
        "Healthcare Domain",
        "dicom",
        "Business Analysis",
        "Radiology",
        "Medical Imaging",
        "US Healthcare",
        "Analysis",
        "Medical",
      ],
      postedDate: "1 week ago",
      workMode: "Hybrid",
      description:
        "Experience - 5+ years. Location - Pune, Mumbai, Chennai, Hyderabad, Bangalore. We are seek...",
      applyUrl:
        "https://www.naukri.com/job-listings-business-analyst-citiustech-pune-bengaluru-mumbai-all-areas-5-to-8-years-231025010742",
    },
    {
      id: "69",
      title: "SAP Security -Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 45669,
      },
      location: ["Mumbai (All Areas)", "Pune", "Delhi / NCR"],
      experience: {
        min: 1,
        max: 6,
        unit: "years",
      },
      skills: [
        "Sap Security And Grc",
        "SAP Security",
        "SAP GRC",
        "Saps",
        "SAP",
        "Security",
        "GRC",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "With over four decades of experience in managing the systems and workings of global ent...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-security-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-1-to-6-years-101025028642",
    },
    {
      id: "70",
      title: "Terraform Engineer",
      company: {
        name: "Capgemini",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1288.gif",
        rating: 3.7,
        reviewCount: 49739,
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 8,
        max: 12,
        unit: "years",
      },
      skills: [
        "Terraform",
        "Servicenow",
        "Chef Puppet",
        "Ansible",
        "Dynatrace",
        "Puppet",
      ],
      postedDate: "Few hours ago",
      workMode: "Hybrid",
      badges: ["Prefers women"],
      description:
        "Given your work experience, we believe it would be a great opportunity for you to progress...",
      applyUrl:
        "https://www.naukri.com/job-listings-terraform-engineer-capgemini-pune-bengaluru-mumbai-all-areas-8-to-12-years-301025022150",
    },
    {
      id: "71",
      title: "SAP BASIS -Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 45669,
      },
      location: ["Mumbai (All Areas)", "Pune", "Delhi / NCR"],
      experience: {
        min: 1,
        max: 6,
        unit: "years",
      },
      skills: ["Sap Basis Hana", "Basis", "SAP Basis", "SAP", "SAP Hana"],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "With over four decades of experience in managing the systems and workings of global ent...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-basis-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-1-to-6-years-101025028828",
    },
    {
      id: "72",
      title: "SAP SD -Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 45669,
      },
      location: ["Mumbai (All Areas)", "Pune", "Delhi / NCR"],
      experience: {
        min: 5,
        max: 10,
        unit: "years",
      },
      skills: [
        "SAP SD",
        "Sales And Distribution",
        "Sap Sales And Distribution",
        "SAP Presales",
        "Saps",
        "SAP",
        "Sales",
        "Distribution",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Minimum Qualifications: Bachelors or Masters degree in Computer Science, Information...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-sd-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-5-to-10-years-101025029150",
    },
    {
      id: "73",
      title:
        "EPM Principal/Sr Principal Consultant FCCS/ARCS/TRCS/PBCS/EPBCS/PCMCS",
      company: {
        name: "Oracle",
        logo: "https://img.naukimg.com/logo_images/groups/v1/18850.gif",
        rating: 3.5,
        reviewCount: 6058,
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 10,
        max: 20,
        unit: "years",
      },
      skills: [
        "EPM",
        "Cloud EPM",
        "solution design",
        "consulting",
        "implementation",
        "EPBCS",
        "EPRCS",
        "PBCS",
      ],
      postedDate: "1 week ago",
      workMode: "Hybrid",
      description:
        "Additional Requirements: EPM Experience 5+ Years Experience in Implementation of EPM...",
      applyUrl:
        "https://www.naukri.com/job-listings-epm-principal-sr-principal-consultant-fccs-arcs-trcs-pbcs-epbcs-pcmcs-oracle-pune-bengaluru-mumbai-all-areas-10-to-20-years-180425012410",
    },
    {
      id: "74",
      title: "Aws Data Engineer",
      company: {
        name: "Citiustech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/682834.gif",
        rating: 3.2,
        reviewCount: 1913,
      },
      location: ["Mumbai (All Areas)", "Pune", "Chennai"],
      experience: {
        min: 3,
        max: 5,
        unit: "years",
      },
      skills: [
        "Pyspark",
        "Terraform",
        "Aws Glue",
        "Python",
        "databricks",
        "AWS",
        "Angular",
        "Data Bricks",
      ],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "Shift Timings - 2:30 PM -11: 30 PM. Experience - 3 years - 5 years. Location - Pune /...",
      applyUrl:
        "https://www.naukri.com/job-listings-aws-data-engineer-citiustech-pune-chennai-mumbai-all-areas-3-to-5-years-291025051014",
    },
    {
      id: "75",
      title: "UI UX -Bangalore",
      company: {
        name: "Infosys",
        logo: "https://img.naukimg.com/logo_images/groups/v1/13832.gif",
        rating: 3.5,
        reviewCount: 45669,
      },
      location: ["Mumbai (All Areas)", "Pune", "Delhi / NCR"],
      experience: {
        min: 4,
        max: 9,
        unit: "years",
      },
      skills: [
        "UI UX",
        "User Experience Design",
        "User Interface Designing",
        "Interfaces",
        "Interface Design",
        "UI",
        "UX",
        "Design",
      ],
      postedDate: "1 day ago",
      workMode: "Work from office",
      badges: ["Prefers women"],
      description:
        "Minimum Qualifications: BTech, MTech, BCA, BSC, MCA, or MSC in a related field. Preferr...",
      applyUrl:
        "https://www.naukri.com/job-listings-ui-ux-bangalore-infosys-pune-delhi-ncr-mumbai-all-areas-4-to-9-years-101025029194",
    },
    {
      id: "76",
      title: "AWS - Technical Specialist",
      company: {
        name: "Citiustech",
        logo: "https://img.naukimg.com/logo_images/groups/v1/682834.gif",
        rating: 3.2,
        reviewCount: 1913,
      },
      location: ["Mumbai (All Areas)", "Pune", "Chennai"],
      experience: {
        min: 7,
        max: 10,
        unit: "years",
      },
      skills: ["Airflow", "Pyspark", "Glue", "AWS", "Python", "Technical"],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "Experience - 7 years - 10 years. Location - Pune / Mumbai / Chennai / Bangalore. Strong...",
      applyUrl:
        "https://www.naukri.com/job-listings-aws-technical-specialist-citiustech-pune-chennai-mumbai-all-areas-7-to-10-years-291025051634",
    },
    {
      id: "77",
      title: "SAP Functional Project Manager",
      company: {
        name: "Capgemini",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1288.gif",
        rating: 3.7,
        reviewCount: 49739,
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 10,
        max: 20,
        unit: "years",
      },
      skills: [
        "SAP Project Manager",
        "S4 Hana implementation",
        "Functional lead",
        "Management",
        "SAP Knowledge",
        "Hana Implementation",
        "SAP",
        "SAP project management",
      ],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "Must have lead medium to large sized teams 50+ FTEs SAP EM With S4HANA Implementation a...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-functional-project-manager-capgemini-pune-bengaluru-mumbai-all-areas-10-to-20-years-291025038044",
    },
    {
      id: "78",
      title: "ABAP FIORI Consultant",
      company: {
        name: "NTT DATA Business Solutions",
        logo: "https://img.naukimg.com/logo_images/groups/v1/709704.gif",
        rating: 3.9,
        reviewCount: 1534,
      },
      location: ["Mumbai (All Areas)", "Hyderabad", "Pune"],
      experience: {
        min: 3,
        max: 5,
        unit: "years",
      },
      skills: ["ODATA", "ABAP", "FIORI", "Consulting", "SAP Fiori"],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "The candidate should have a strong background in ABAP programming and hands-on experience...",
      applyUrl:
        "https://www.naukri.com/job-listings-abap-fiori-consultant-ntt-data-business-solutions-hyderabad-pune-mumbai-all-areas-3-to-5-years-161025027526",
    },
    {
      id: "79",
      title: "Sap Ewm Functional Consultant",
      company: {
        name: "Capgemini",
        logo: "https://img.naukimg.com/logo_images/groups/v1/1288.gif",
        rating: 3.7,
        reviewCount: 49739,
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 6,
        max: 11,
        unit: "years",
      },
      skills: [
        "S/4HANA Embedded EWM Experience",
        "SAP EWM",
        "Ewm",
        "Bins",
        "Handling Unit Management & Physical Inventory",
        "SAP EWM Configuration & Customization",
        "Functional Specification & Testing",
        "Inbound & Outbound Logistics Processes",
      ],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      badges: ["Prefers women"],
      description:
        "Role & responsibilities Configure and implement SAP Extended Warehouse Management (EWM...",
      applyUrl:
        "https://www.naukri.com/job-listings-sap-ewm-functional-consultant-capgemini-pune-bengaluru-mumbai-all-areas-6-to-11-years-101025020072",
    },
    {
      id: "80",
      title: "MuleSoft AMS Engineer",
      company: {
        name: "eLabs Infotech Pvt ltd",
        logo: "https://img.naukimg.com/logo_images/groups/v1/3296168.gif",
      },
      location: ["Mumbai (All Areas)", "Pune", "Bengaluru"],
      experience: {
        min: 5,
        max: 10,
        unit: "years",
      },
      skills: [
        "Mulesoft Integration",
        "Ams",
        "Application Support Management",
        "Integration",
        "MuleSoft Support Engineer",
        "Integration Engineer",
        "MuleSoft AnyPoint Studio",
        "MuleSoft AMS Engineer",
      ],
      postedDate: "1 day ago",
      workMode: "Hybrid",
      description:
        "MuleSoft AMS Engineer Production Support. Experience: 6+ Years. Location: Bangalore, Chennai...",
      applyUrl:
        "https://www.naukri.com/job-listings-mulesoft-ams-engineer-elabs-infotech-pune-bengaluru-mumbai-all-areas-5-to-10-years-291025039379",
    },
  ],
};

export default JobsData;
