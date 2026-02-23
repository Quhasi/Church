import React, { useState, useEffect, useMemo } from "react";
import { 
  UserPlus, Users, LayoutDashboard, LogOut, Search, 
  Printer, CheckCircle, XCircle, ChevronRight, ChevronLeft, 
  Camera, Phone, Mail, MapPin, Home, Heart, BookOpen, 
  Trash2, Eye, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

// Constants
const LOGO_URL = "https://i.pinimg.com/736x/c7/59/46/c75946b2af41df34537044af9e22444e.jpg";
const TITLES = ["Brother", "Sister", "Elder", "Presiding Elder", "Deacon", "Deaconess", "Retired Deacon", "Retired Deaconess"];
const REGIONS = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", 
  "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta", 
  "Western", "Western North"
];
const MINISTRIES = ["Men's Ministry", "Women's Ministry", "Youth Ministry", "Children's Ministry", "Evangelism Ministry"];

const COUNTRY_CODES = [
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
];

// Components
const PhoneInput = ({ label, value, onChange, required = false }: any) => {
  const [selectedCode, setSelectedCode] = useState("+233");
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (value) {
      const match = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (match) {
        setSelectedCode(match.code);
        setNumber(value.replace(match.code, ""));
      } else {
        setNumber(value);
      }
    }
  }, [value]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setNumber(val);
    onChange(selectedCode + val);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCode(e.target.value);
    onChange(e.target.value + number);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label} {required && "*"}</label>
      <div className="flex gap-2">
        <select 
          value={selectedCode}
          onChange={handleCodeChange}
          className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {COUNTRY_CODES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
        <input
          type="tel"
          value={number}
          onChange={handleNumberChange}
          required={required}
          placeholder="551234567"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<"home" | "register" | "admin-login" | "admin-dashboard">("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Registration Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "Brother",
    firstName: "",
    lastName: "",
    gender: "Male",
    dob: "",
    maritalStatus: "Single",
    occupation: "",
    phone: "",
    email: "",
    hometown: "",
    region: "Greater Accra",
    residence: "",
    gpsAddress: "",
    fatherName: "",
    fatherContact: "",
    motherName: "",
    motherContact: "",
    emergencyContact: "",
    baptismStatus: "Baptized",
    baptismDate: "",
    ministry: "Men's Ministry",
    homeCell: "",
    bibleStudyGroup: "",
    photo: ""
  });

  useEffect(() => {
    if (isAdmin) {
      fetchMembers();
    }
  }, [isAdmin]);

  const fetchMembers = async () => {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Registration submitted successfully!");
        setPage("home");
        setStep(1);
        setFormData({
          title: "Brother",
          firstName: "",
          lastName: "",
          gender: "Male",
          dob: "",
          maritalStatus: "Single",
          occupation: "",
          phone: "",
          email: "",
          hometown: "",
          region: "Greater Accra",
          residence: "",
          gpsAddress: "",
          fatherName: "",
          fatherContact: "",
          motherName: "",
          motherContact: "",
          emergencyContact: "",
          baptismStatus: "Baptized",
          baptismDate: "",
          ministry: "Men's Ministry",
          homeCell: "",
          bibleStudyGroup: "",
          photo: ""
        });
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      setIsAdmin(true);
      setPage("admin-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleAction = async (id: number, action: "approve" | "reject") => {
    await fetch(`/api/members/${id}/${action}`, { method: "POST" });
    fetchMembers();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await fetch(`/api/members/${id}`, { method: "DELETE" });
      fetchMembers();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${selectedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        alert("Member updated successfully!");
        setIsEditing(false);
        setSelectedMember({ ...selectedMember, ...editFormData });
        fetchMembers();
      }
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditFormData({ ...selectedMember });
    setIsEditing(true);
  };

  const handlePhotoEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({ ...editFormData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter(m => m.status === "pending").length;
    const approved = members.filter(m => m.status === "approved").length;
    
    const genderData = [
      { name: "Male", value: members.filter(m => m.gender === "Male").length },
      { name: "Female", value: members.filter(m => m.gender === "Female").length }
    ];
    
    const maritalData = [
      { name: "Single", value: members.filter(m => m.maritalStatus === "Single").length },
      { name: "Married", value: members.filter(m => m.maritalStatus === "Married").length },
      { name: "Widowed", value: members.filter(m => m.maritalStatus === "Widowed").length },
      { name: "Divorced", value: members.filter(m => m.maritalStatus === "Divorced").length }
    ];

    return { total, pending, approved, genderData, maritalData };
  }, [members]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const printMemberSheet = () => {
    const originalTitle = document.title;
    document.title = `Member_Record_${selectedMember.firstName}_${selectedMember.lastName}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
              <img src={LOGO_URL} alt="COP Logo" className="w-10 h-10 rounded-full shadow-sm" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-blue-900 leading-tight">THE CHURCH OF PENTECOST</h1>
                <p className="text-xs text-gray-500 font-medium">Abensu Assembly - Achimota Area</p>
              </div>
            </div>
            <div className="flex gap-4">
              {page === "home" && (
                <>
                  <button onClick={() => setPage("register")} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <UserPlus size={18} />
                    <span className="hidden sm:inline">Become a Member</span>
                  </button>
                  <button onClick={() => setPage("admin-login")} className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    <span className="hidden sm:inline">Admin Portal</span>
                  </button>
                </>
              )}
              {isAdmin && page === "admin-dashboard" && (
                <button onClick={() => { setIsAdmin(false); setPage("home"); }} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
              {(page === "register" || page === "admin-login") && (
                <button onClick={() => setPage("home")} className="text-gray-600 hover:text-blue-600 font-medium">
                  Back to Home
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <img src={LOGO_URL} alt="COP Logo" className="w-48 h-48 mx-auto mb-8 rounded-full shadow-xl border-4 border-white" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">Welcome to Abensu Assembly</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                Join our family in Christ. Register today to become a member of The Church of Pentecost, Abensu Assembly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setPage("register")}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <UserPlus size={24} />
                  Register as a Member
                </button>
                <button 
                  onClick={() => setPage("admin-login")}
                  className="bg-white text-blue-900 border-2 border-blue-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
                >
                  <LayoutDashboard size={24} />
                  Administrator Login
                </button>
              </div>
            </motion.div>
          )}

          {page === "register" && (
            <motion.div 
              key="register"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-blue-900 p-8 text-white text-center">
                <img src={LOGO_URL} alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-white" />
                <h2 className="text-2xl font-bold">Membership Registration</h2>
                <p className="text-blue-200 text-sm mt-1">Please fill out the form accurately</p>
                
                <div className="flex justify-center mt-8 gap-4">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-white text-blue-900' : 'bg-blue-800 text-blue-300'}`}>
                        {s}
                      </div>
                      {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-white' : 'bg-blue-800'}`} />}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleRegister} className="p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Step 1: Personal Information</h3>
                    
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                          {formData.photo ? (
                            <img src={formData.photo} alt="Passport" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="text-gray-400" size={32} />
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg group-hover:bg-blue-700">
                          <Camera size={16} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Upload Passport Picture</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Title *</label>
                        <select 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">First Name *</label>
                        <input 
                          type="text" required
                          value={formData.firstName}
                          onChange={e => setFormData({...formData, firstName: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input 
                          type="text" required
                          value={formData.lastName}
                          onChange={e => setFormData({...formData, lastName: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Gender *</label>
                        <select 
                          value={formData.gender}
                          onChange={e => setFormData({...formData, gender: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                        <input 
                          type="date" required
                          value={formData.dob}
                          onChange={e => setFormData({...formData, dob: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Marital Status *</label>
                        <select 
                          value={formData.maritalStatus}
                          onChange={e => setFormData({...formData, maritalStatus: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Occupation</label>
                        <input 
                          type="text"
                          value={formData.occupation}
                          onChange={e => setFormData({...formData, occupation: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <PhoneInput 
                        label="Phone Number" 
                        required 
                        value={formData.phone}
                        onChange={(val: string) => setFormData({...formData, phone: val})}
                      />
                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Step 2: Address & Family</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Hometown *</label>
                        <input 
                          type="text" required
                          value={formData.hometown}
                          onChange={e => setFormData({...formData, hometown: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Region *</label>
                        <select 
                          value={formData.region}
                          onChange={e => setFormData({...formData, region: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Place of Residence *</label>
                        <input 
                          type="text" required
                          value={formData.residence}
                          onChange={e => setFormData({...formData, residence: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Digital Address (GPS)</label>
                        <input 
                          type="text"
                          value={formData.gpsAddress}
                          onChange={e => setFormData({...formData, gpsAddress: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 pt-4">
                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">Parental Information</h4>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                        <input 
                          type="text"
                          value={formData.fatherName}
                          onChange={e => setFormData({...formData, fatherName: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <PhoneInput 
                        label="Father's Contact" 
                        value={formData.fatherContact}
                        onChange={(val: string) => setFormData({...formData, fatherContact: val})}
                      />
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                        <input 
                          type="text"
                          value={formData.motherName}
                          onChange={e => setFormData({...formData, motherName: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <PhoneInput 
                        label="Mother's Contact" 
                        value={formData.motherContact}
                        onChange={(val: string) => setFormData({...formData, motherContact: val})}
                      />
                      <div className="sm:col-span-2">
                        <PhoneInput 
                          label="Emergency Contact Number *" 
                          required
                          value={formData.emergencyContact}
                          onChange={(val: string) => setFormData({...formData, emergencyContact: val})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Step 3: Church Life</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Baptism Status *</label>
                        <select 
                          value={formData.baptismStatus}
                          onChange={e => setFormData({...formData, baptismStatus: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Baptized">Baptized</option>
                          <option value="Not Baptized">Not Baptized</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Date of Baptism</label>
                        <input 
                          type="date"
                          value={formData.baptismDate}
                          onChange={e => setFormData({...formData, baptismDate: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Ministry *</label>
                        <select 
                          value={formData.ministry}
                          onChange={e => setFormData({...formData, ministry: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          {MINISTRIES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Home Cell</label>
                        <input 
                          type="text"
                          value={formData.homeCell}
                          onChange={e => setFormData({...formData, homeCell: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Bible Study Group</label>
                        <input 
                          type="text"
                          value={formData.bibleStudyGroup}
                          onChange={e => setFormData({...formData, bibleStudyGroup: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Step 4: Review Your Details</h3>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-4">
                      Please review all information below. If everything is correct, click "Complete Registration".
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2 flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Camera size={20} className="text-gray-400" /></div>}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-blue-900">{formData.title} {formData.firstName} {formData.lastName}</p>
                          <p className="text-gray-500">{formData.gender} • {formData.dob}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Contact & Residence</p>
                        <p className="text-sm"><strong>Phone:</strong> {formData.phone}</p>
                        <p className="text-sm"><strong>Email:</strong> {formData.email || "N/A"}</p>
                        <p className="text-sm"><strong>Residence:</strong> {formData.residence}</p>
                        <p className="text-sm"><strong>Hometown:</strong> {formData.hometown} ({formData.region})</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Family</p>
                        <p className="text-sm"><strong>Father:</strong> {formData.fatherName || "N/A"} ({formData.fatherContact || "N/A"})</p>
                        <p className="text-sm"><strong>Mother:</strong> {formData.motherName || "N/A"} ({formData.motherContact || "N/A"})</p>
                        <p className="text-sm"><strong>Emergency:</strong> {formData.emergencyContact}</p>
                      </div>

                      <div className="sm:col-span-2 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Church Life</p>
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-sm"><strong>Baptism:</strong> {formData.baptismStatus} {formData.baptismDate && `(${formData.baptismDate})`}</p>
                          <p className="text-sm"><strong>Ministry:</strong> {formData.ministry}</p>
                          <p className="text-sm"><strong>Home Cell:</strong> {formData.homeCell || "N/A"}</p>
                          <p className="text-sm"><strong>Bible Study:</strong> {formData.bibleStudyGroup || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-10">
                  {step > 1 && (
                    <button 
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-900 font-bold"
                    >
                      <ChevronLeft size={20} /> Previous
                    </button>
                  )}
                  <div className="flex-1" />
                  {step < 4 ? (
                    <button 
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800"
                    >
                      Next <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 shadow-lg"
                    >
                      {loading ? "Submitting..." : "Complete Registration"}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {page === "admin-login" && (
            <motion.div 
              key="admin-login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl"
            >
              <div className="text-center mb-8">
                <img src={LOGO_URL} alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-full" />
                <h2 className="text-2xl font-bold text-blue-900">Admin Portal</h2>
                <p className="text-gray-500">Secure access for church administrators</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" name="password" required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                  Login to Dashboard
                </button>
              </form>
            </motion.div>
          )}

          {page === "admin-dashboard" && (
            <motion.div 
              key="admin-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Members</p>
                      <h3 className="text-2xl font-bold">{stats.total}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Pending Applications</p>
                      <h3 className="text-2xl font-bold">{stats.pending}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Approved Members</p>
                      <h3 className="text-2xl font-bold">{stats.approved}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-6">Gender Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.genderData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ec4899" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-600">Male</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500" />
                      <span className="text-sm text-gray-600">Female</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-6">Marital Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.maritalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Member List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="text-lg font-bold">Member Management</h3>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search name, phone..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                      <tr>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredMembers.map(m => (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                {m.photo ? <img src={m.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Users size={20} /></div>}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{m.title} {m.firstName} {m.lastName}</p>
                                <p className="text-xs text-gray-500">{m.gender} • {m.maritalStatus}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium">{m.phone}</p>
                            <p className="text-xs text-gray-500">{m.email || "No email"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium">{m.residence}</p>
                            <p className="text-xs text-gray-500">{m.hometown}, {m.region}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              m.status === 'approved' ? 'bg-green-100 text-green-700' : 
                              m.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => setSelectedMember(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                              <Eye size={18} />
                            </button>
                            {m.status === 'pending' && (
                              <>
                                <button onClick={() => handleAction(m.id, 'approve')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                  <CheckCircle size={18} />
                                </button>
                                <button onClick={() => handleAction(m.id, 'reject')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDelete(m.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Member Details Modal / Sheet */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8"
          >
            <div className="flex justify-between items-center p-6 border-b bg-gray-50 no-print">
              <h3 className="text-xl font-bold text-blue-900">
                {isEditing ? "Edit Member Details" : "Member Registration Record"}
              </h3>
              <div className="flex gap-4">
                {!isEditing && (
                  <>
                    <button 
                      onClick={handleEditClick}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-300"
                    >
                      Edit Details
                    </button>
                    <button 
                      onClick={printMemberSheet}
                      className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800"
                    >
                      <Printer size={18} /> Print Sheet
                    </button>
                  </>
                )}
                <button onClick={() => { setSelectedMember(null); setIsEditing(false); }} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-10 print-area" id="printable-sheet">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2 flex flex-col items-center">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                          {editFormData.photo ? (
                            <img src={editFormData.photo} alt="Passport" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="text-gray-400" size={32} />
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoEdit}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                          <Camera size={16} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Update Passport Picture</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <select 
                        value={editFormData.title}
                        onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input 
                        type="text" required
                        value={editFormData.firstName}
                        onChange={e => setEditFormData({...editFormData, firstName: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input 
                        type="text" required
                        value={editFormData.lastName}
                        onChange={e => setEditFormData({...editFormData, lastName: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input 
                        type="text" required
                        value={editFormData.phone}
                        onChange={e => setEditFormData({...editFormData, phone: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Residence</label>
                      <input 
                        type="text" required
                        value={editFormData.residence}
                        onChange={e => setEditFormData({...editFormData, residence: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Region</label>
                      <select 
                        value={editFormData.region}
                        onChange={e => setEditFormData({...editFormData, region: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Ministry</label>
                      <select 
                        value={editFormData.ministry}
                        onChange={e => setEditFormData({...editFormData, ministry: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {MINISTRIES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                      <select 
                        value={editFormData.maritalStatus}
                        onChange={e => setEditFormData({...editFormData, maritalStatus: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-blue-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-800 disabled:bg-gray-400"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Header for Print */}
                  <div className="flex items-center justify-between mb-8 border-b-2 border-blue-900 pb-6">
                <div className="flex items-center gap-4">
                  <img src={LOGO_URL} alt="Logo" className="w-20 h-20 rounded-full" />
                  <div>
                    <h1 className="text-2xl font-black text-blue-900 uppercase">The Church of Pentecost</h1>
                    <p className="text-sm font-bold text-gray-600">Abensu Assembly - Achimota Area</p>
                    <p className="text-xs text-gray-500">Member Registration Official Record</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {selectedMember.photo ? (
                      <img src={selectedMember.photo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] text-center p-2">
                        Passport Picture
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                <section className="col-span-2">
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b border-gray-100 pb-1 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Full Name</p>
                      <p className="text-sm font-bold">{selectedMember.title} {selectedMember.firstName} {selectedMember.lastName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Gender</p>
                      <p className="text-sm font-bold">{selectedMember.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Date of Birth</p>
                      <p className="text-sm font-bold">{new Date(selectedMember.dob).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Marital Status</p>
                      <p className="text-sm font-bold">{selectedMember.maritalStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Occupation</p>
                      <p className="text-sm font-bold">{selectedMember.occupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Contact Number</p>
                      <p className="text-sm font-bold">{selectedMember.phone}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b border-gray-100 pb-1 mb-4">Address & Origin</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Hometown</p>
                      <p className="text-sm font-bold">{selectedMember.hometown}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Region</p>
                      <p className="text-sm font-bold">{selectedMember.region}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Residence</p>
                      <p className="text-sm font-bold">{selectedMember.residence}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">GPS Address</p>
                      <p className="text-sm font-bold font-mono">{selectedMember.gpsAddress || "N/A"}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b border-gray-100 pb-1 mb-4">Family Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Father's Name & Contact</p>
                      <p className="text-sm font-bold">{selectedMember.fatherName || "N/A"}</p>
                      <p className="text-xs text-gray-500">{selectedMember.fatherContact || ""}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Mother's Name & Contact</p>
                      <p className="text-sm font-bold">{selectedMember.motherName || "N/A"}</p>
                      <p className="text-xs text-gray-500">{selectedMember.motherContact || ""}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Emergency Contact</p>
                      <p className="text-sm font-bold">{selectedMember.emergencyContact}</p>
                    </div>
                  </div>
                </section>

                <section className="col-span-2">
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b border-gray-100 pb-1 mb-4">Church Life</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Baptism Status</p>
                      <p className="text-sm font-bold">{selectedMember.baptismStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Baptism Date</p>
                      <p className="text-sm font-bold">{selectedMember.baptismDate ? new Date(selectedMember.baptismDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Ministry</p>
                      <p className="text-sm font-bold">{selectedMember.ministry}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Home Cell</p>
                      <p className="text-sm font-bold">{selectedMember.homeCell || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Bible Study Group</p>
                      <p className="text-sm font-bold">{selectedMember.bibleStudyGroup || "N/A"}</p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Footer for Print */}
              {!isEditing && (
                <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
                  <div>
                    <div className="w-48 border-b border-gray-400 mb-2"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Member Signature</p>
                  </div>
                  <div className="text-right">
                    <div className="w-48 border-b border-gray-400 mb-2 ml-auto"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Presiding Elder Signature</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src={LOGO_URL} alt="Logo" className="w-12 h-12 mx-auto mb-4 rounded-full grayscale opacity-50" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">The Church of Pentecost</p>
          <p className="text-gray-400 text-sm mt-1">Abensu Assembly - Achimota Area</p>
          <div className="flex justify-center gap-6 mt-6 text-gray-400">
            <Mail size={20} className="hover:text-blue-900 cursor-pointer" />
            <Phone size={20} className="hover:text-blue-900 cursor-pointer" />
            <MapPin size={20} className="hover:text-blue-900 cursor-pointer" />
          </div>
          <p className="text-gray-300 text-[10px] mt-8">© {new Date().getFullYear()} Abensu Assembly Database. All Rights Reserved.</p>
        </div>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-area { padding: 0 !important; margin: 0 !important; }
          #printable-sheet { box-shadow: none !important; border: none !important; }
          @page { margin: 1cm; }
        }
        .print-area {
          background: white;
        }
      `}</style>
    </div>
  );
}
