import { Menu, Search, HelpCircle, Bell } from "lucide-react";

export function Header() {
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center">
                <button className="text-gray-500 hover:text-gray-900 md:hidden mr-4">
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-gray-500">
                <button className="hover:text-gray-900 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button className="hover:text-gray-900 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="relative hover:text-gray-900 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#f5222d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        8
                    </span>
                </button>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#fde8e9] flex items-center justify-center overflow-hidden">
                        {/* Simple Avatar Placeholder */}
                        <svg className="w-full h-full text-[#8B2635]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">John</span>
                </div>
            </div>
        </div>
    );
}
