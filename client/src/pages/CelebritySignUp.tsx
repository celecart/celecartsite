import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  BadgeCheck,
  Globe,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export default function CelebritySignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Celebrity-specific
  const [profession, setProfession] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  // Default image used if no profile picture provided
  const DEFAULT_IMAGE_URL = "/assets/kendall-jenner.svg";

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (e) {
        // ignore
      }
    };
    loadCategories();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email is required";
    if (!password || password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!username && !displayName) e.username = "Username or display name is required";
    if (!profession) e.profession = "Profession is required";
    if (!categoryId) e.categoryId = "Category is required";
    // Celebrity image no longer required; will default
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    if (file) setProfilePreview(URL.createObjectURL(file));
    else setProfilePreview(null);
  };

  // Removed celebrity image and verification document handlers

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      // 1) Create user account (Pending Verification)
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("username", username);
      formData.append("displayName", displayName);
      formData.append("password", password);
      formData.append("accountStatus", "Pending Verification");
      if (profileFile) formData.append("profilePicture", profileFile);

      const signupRes = await fetch("/auth/signup", { method: "POST", body: formData, credentials: "include" });
      if (!signupRes.ok) {
        const errorData = await signupRes.json().catch(() => ({ message: "Signup failed" }));
        toast({ title: "Signup failed", description: errorData.message || "Please check your information and try again.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const signupData = await signupRes.json();

      // 4) Create celebrity profile
      const name = (displayName || `${firstName} ${lastName}` || username).trim();
      const selectedCategory = categories.find(c => c.id === Number(categoryId));
      const descriptionParts = [] as string[];
      if (instagram) descriptionParts.push(`Instagram: ${instagram}`);
      if (twitter) descriptionParts.push(`Twitter: ${twitter}`);
      if (youtube) descriptionParts.push(`YouTube: ${youtube}`);
      if (tiktok) descriptionParts.push(`TikTok: ${tiktok}`);
      const description = descriptionParts.join(" | ");

      const celebrityPayload = {
        name,
        profession,
        imageUrl: (signupData?.user?.profilePicture as string) || DEFAULT_IMAGE_URL,
        description: description || undefined,
        category: selectedCategory?.name || "Red Carpet",
        isElite: false,
        managerInfo: null,
        stylingDetails: null,
      };

      const celebRes = await fetch("/api/my/celebrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(celebrityPayload),
      });
      if (!celebRes.ok) {
        const err = await celebRes.json().catch(() => ({ message: "Celebrity creation failed" }));
        toast({ title: "Celebrity profile failed", description: err.message || "Please review the information and try again.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      toast({ title: "Welcome to CeleCart", description: `Celebrity account created for ${name}. Awaiting verification.` });
      setTimeout(() => setLocation("/login"), 900);
    } catch (error) {
      toast({ title: "Network error", description: "Unable to sign up at the moment. Please try again later.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a071b] via-[#0f0b2d] to-[#1b143f] text-white">
      {/* Premium header with exclusive crest */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/10 via-violet-500/10 to-transparent translate-x-[-10%] translate-y-[-10%]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-2 flex items-center justify-between">
          <Link href="/" className="text-white/60 hover:text-white/80 transition-colors flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-fuchsia-300">
            <Sparkles className="h-5 w-5" />
            <span className="uppercase tracking-widest text-xs">Celebrity Access</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-6 py-6"
      >
        {/* Card */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/10 via-purple-500/10 to-amber-400/10 pointer-events-none" />
          <div className="p-6 md:p-8 relative">
            {/* Crest */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-black/80" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Celebrity Sign-Up</h1>
                <p className="text-white/50 text-sm">Premium access with exclusive branding for verified celebrity accounts</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5 mt-4">
              {/* First Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.firstName ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                </div>
                {errors.firstName && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.firstName}</p>)}
              </div>

              {/* Last Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.lastName ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                </div>
                {errors.lastName && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.lastName}</p>)}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                </div>
                {errors.email && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>)}
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.username ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                </div>
                {errors.username && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.username}</p>)}
              </div>

              {/* Display Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>)}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>)}
              </div>

              {/* Profile Picture (optional, account) */}
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2 text-white/70">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm">Account Profile picture (optional)</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleProfileChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-500/20 file:text-fuchsia-300 hover:file:bg-fuchsia-500/30 text-white" />
                  {profilePreview && (<img src={profilePreview} alt="Profile preview" className="mt-3 h-24 w-24 rounded-lg object-cover border border-white/10" />)}
                </div>
              </div>

              {/* Profession */}
              <div>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Profession (e.g., Actor, Athlete, Musician)"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.profession ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50 focus:bg-white/10 transition-all`}
                  />
                </div>
                {errors.profession && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.profession}</p>)}
              </div>

              {/* Category */}
              <div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.categoryId ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:border-fuchsia-400/50 transition-all`}
                  >
                    <option value="" className="text-black">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="text-black">{c.name}</option>
                    ))}
                  </select>
                </div>
                {errors.categoryId && (<p className="text-red-400 text-xs mt-1 ml-1">{errors.categoryId}</p>)}
              </div>

              {/* Social media handles */}
              <div className="md:col-span-2 grid md:grid-cols-2 gap-5">
                <input type="text" placeholder="Instagram handle (optional)" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50" />
                <input type="text" placeholder="Twitter/X handle (optional)" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50" />
                <input type="text" placeholder="YouTube channel (optional)" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50" />
                <input type="text" placeholder="TikTok handle (optional)" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400/50" />
              </div>

              {/* Removed: Celebrity card image, verification document, manager/publicist, booking & collaboration fields */}

              {/* Submit */}
              <div className="md:col-span-2 mt-2">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                    isLoading ? "bg-white/10 cursor-not-allowed" : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-amber-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-amber-600 shadow-lg hover:shadow-fuchsia-500/25"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating celebrity account...
                    </div>
                  ) : (
                    "Create Celebrity Account"
                  )}
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 text-white/40 text-sm">
              <p>
                Prefer the standard experience? {" "}
                <Link href="/signup" className="text-fuchsia-300 hover:text-fuchsia-200 transition-colors">Go to standard sign-up</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}