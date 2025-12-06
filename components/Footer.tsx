"use client";

// import Link from "next/link";
// import { 
//   FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTiktok,
//   FaCcVisa, FaCcMastercard, FaMoneyBillWave 
// } from "react-icons/fa";
// import { CreditCard, MapPin, Phone, Mail, Send } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="bg-[#222831] text-[#EEEEEE] border-t border-[#393E46]">
      
//       {/* 1. TOP SECTION: Newsletter & Socials */}
//       <div className="border-b border-[#393E46]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
//             {/* Newsletter */}
//             <div className="w-full md:w-1/2">
//               <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">
//                 Subscribe to our Newsletter
//               </h3>
//               <p className="text-sm text-gray-400 mb-4">
//                 Get the latest updates on new products and upcoming sales.
//               </p>
//               <div className="flex relative max-w-md">
//                 <input 
//                   type="email" 
//                   placeholder="Enter your email address" 
//                   className="w-full bg-[#393E46] text-white px-4 py-3 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
//                 />
//                 <button className="bg-[#00ADB5] hover:bg-[#008c93] text-white px-6 rounded-r-md transition-colors flex items-center">
//                   <Send size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Social Icons */}
//             <div className="flex gap-4">
//               {[FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTiktok].map((Icon, idx) => (
//                 <Link 
//                   key={idx} 
//                   href="#" 
//                   className="bg-[#393E46] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#00ADB5] hover:text-white transition-all transform hover:-translate-y-1"
//                 >
//                   <Icon size={18} />
//                 </Link>
//               ))}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* 2. MAIN CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
//           {/* Column 1: Brand Info */}
//           <div className="space-y-4">
//              <Link href="/" className="text-3xl font-extrabold tracking-tight block">
//               <span className="text-white">Ceylo</span>
//               <span className="text-[#00ADB5]">tek</span>
//               <span className="text-white">.lk</span>
//             </Link>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               &ldquo;Technology is best when it brings people together.&rdquo; <br/>
//               Your trusted partner for genuine electronics, fast delivery, and premium customer support in Sri Lanka.
//             </p>
//           </div>

//           {/* Column 2: Useful Links */}
//           <div>
//             <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-l-4 border-[#00ADB5] pl-3">
//               Useful Links
//             </h4>
//             <ul className="space-y-2 text-sm text-gray-400">
//               {['About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy', 'Track Order'].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-[#00ADB5] transition-colors flex items-center gap-2">
//                     <span className="w-1.5 h-1.5 bg-[#00ADB5] rounded-full"></span>
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Contact Details */}
//           <div>
//             <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-l-4 border-[#00ADB5] pl-3">
//               Contact Us
//             </h4>
//             <ul className="space-y-4 text-sm text-gray-400">
//               <li className="flex items-start gap-3">
//                 <MapPin className="text-[#00ADB5] mt-0.5 flex-shrink-0" size={18} />
//                 <span>No. 123, Tech Street, <br/> Colombo 03, Sri Lanka.</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Phone className="text-[#00ADB5] flex-shrink-0" size={18} />
//                 <span>+94 77 123 4567</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail className="text-[#00ADB5] flex-shrink-0" size={18} />
//                 <span>support@ceylotek.lk</span>
//               </li>
//             </ul>
//           </div>

//           {/* Column 4: Customer Service */}
//           <div>
//              <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-l-4 border-[#00ADB5] pl-3">
//               Customer Care
//             </h4>
//             <ul className="space-y-2 text-sm text-gray-400">
//               {['My Account', 'Wishlist', 'Order History', 'Returns', 'FAQs'].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-[#00ADB5] transition-colors">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//         </div>
//       </div>

//       {/* 3. BOTTOM BAR: Copyright & Payment */}
//       <div className="bg-[#1a1f26] border-t border-[#393E46]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
//             <p className="text-xs text-gray-500 text-center md:text-left">
//               &copy; {new Date().getFullYear()} Ceylotek.lk. All Rights Reserved. 
//               <span className="hidden sm:inline"> | Designed for Excellence.</span>
//             </p>

//             {/* Payment Icons */}
//             <div className="flex items-center gap-3">
//               <span className="text-xs text-gray-500 mr-2">We Accept:</span>
//               <div className="flex gap-2 text-2xl text-gray-400">
//                  <FaCcVisa className="hover:text-white transition-colors" title="Visa" />
//                  <FaCcMastercard className="hover:text-white transition-colors" title="Mastercard" />
//                  {/* PayHere isn't in FontAwesome, using Generic Credit Card */}
//                  <CreditCard className="hover:text-white transition-colors" title="PayHere" />
//                  <div className="flex items-center gap-1 bg-gray-700 px-2 rounded text-[10px] font-bold h-[24px] hover:bg-gray-600 cursor-default" title="Cash on Delivery">
//                     <FaMoneyBillWave className="text-[#00ADB5]" /> COD
//                  </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//     </footer>
//   );
// };

// export default Footer;


"use client";

import Link from "next/link";
import { 
  FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTiktok,
  FaCcVisa, FaCcMastercard, FaMoneyBillWave 
} from "react-icons/fa";
import { CreditCard, MapPin, Phone, Mail, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-[#EEEEEE] border-t border-[#393E46]">
      
      {/* 1. TOP SECTION: Newsletter & Socials */}
      <div className="border-b border-[#393E46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Newsletter */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">
                Subscribe to our Newsletter
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates on new products and upcoming sales.
              </p>
              <div className="flex relative max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-[#393E46] text-white px-4 py-3 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
                />
                <button className="bg-[#00ADB5] hover:bg-[#008c93] text-white px-6 rounded-r-md transition-colors flex items-center">
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Social Icons with Brand Colors */}
            <div className="flex gap-4">
              {[
                { Icon: FaFacebookF, color: "hover:bg-[#1877F2]" },
                { Icon: FaInstagram, color: "hover:bg-[#E4405F]" },
                { Icon: FaYoutube, color: "hover:bg-[#FF0000]" },
                { Icon: FaWhatsapp, color: "hover:bg-[#25D366]" },
                { Icon: FaTiktok, color: "hover:bg-black hover:border hover:border-white/20" }
              ].map(({ Icon, color }, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className={`bg-[#393E46] w-10 h-10 flex items-center justify-center rounded-full hover:text-white transition-all transform hover:-translate-y-1 ${color}`}
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Changed grid cols from 4 to 3 since we removed one column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
             <Link href="/" className="text-3xl font-extrabold tracking-tight block">
              <span className="text-white">Ceylo</span>
              <span className="text-[#00ADB5]">tek</span>
              <span className="text-white">.lk</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              &ldquo;Technology is best when it brings people together.&rdquo; <br/>
              Your trusted partner for genuine electronics, fast delivery, and premium customer support in Sri Lanka.
            </p>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-b-2 border-[#00ADB5] inline-block pb-1 md:border-b-0 md:border-l-4 md:pl-3 md:pb-0">
              Useful Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy', 'FAQs'].map((item) => (
                <li key={item}>
                  {/* <Link href="#" className="hover:text-[#00ADB5] transition-colors flex items-center gap-2 justify-center md:justify-start"> */}
                    <span className="w-1.5 h-1.5 bg-[#00ADB5] rounded-full hidden md:block"></span>
                    {item}
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-b-2 border-[#00ADB5] inline-block pb-1 md:border-b-0 md:border-l-4 md:pl-3 md:pb-0">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <MapPin className="text-[#00ADB5] mt-0.5 flex-shrink-0" size={18} />
                <span>No. 123, Tech Street, <br/> Colombo 03, Sri Lanka.</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-3">
                <Phone className="text-[#00ADB5] flex-shrink-0" size={18} />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-3">
                <Mail className="text-[#00ADB5] flex-shrink-0" size={18} />
                <span>support@ceylotek.lk</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM BAR: Copyright & Payment */}
      <div className="bg-[#1a1f26] border-t border-[#393E46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <p className="text-xs text-gray-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Ceylotek.lk. All Rights Reserved.
            </p>

            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 mr-2">We Accept:</span>
              <div className="flex gap-2 text-2xl text-gray-400">
                 <FaCcVisa className="hover:text-white transition-colors" title="Visa" />
                 <FaCcMastercard className="hover:text-white transition-colors" title="Mastercard" />
                 {/* PayHere isn't in FontAwesome, using Generic Credit Card */}
                 <CreditCard className="hover:text-white transition-colors" aria-label="PayHere" />
                 <div className="flex items-center gap-1 bg-gray-700 px-2 rounded text-[10px] font-bold h-[24px] hover:bg-gray-600 cursor-default" title="Cash on Delivery">
                    <FaMoneyBillWave className="text-[#00ADB5]" /> COD
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;