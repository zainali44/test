import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Products",
      links: [
        { name: "Personal VPN", href: "#" },
        { name: "Business VPN", href: "#" },
        { name: "Teams", href: "#" },
        { name: "Dedicated IP", href: "#" },
        { name: "Password Manager", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Server Status", href: "#" },
        { name: "Speed Test", href: "#" },
        { name: "Contact Us", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
      ],
    },
    {
      title: "Connect",
      links: [
        { name: "Twitter", href: "#" },
        { name: "Facebook", href: "#" },
        { name: "Instagram", href: "#" },
        { name: "LinkedIn", href: "#" },
        { name: "YouTube", href: "#" },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-purple-400" />
              <span className="font-bold text-xl">crestVPN</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              crest your online presence with military-grade encryption and unlimited bandwidth. Stay private, stay
              crest.
            </p>
            <div className="flex gap-4">
              {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v2h-2V7zm0 4h2v6h-2v-6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-lg mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {currentYear} crestVPN. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
