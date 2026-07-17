import { Link } from "react-scroll";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">

      <div className="max-w-7xl mx-auto px-6 py-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
   
          <div>
            <h2 className="text-3xl font-bold text-blue-600">
              OrganizeNotes
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
              Organize subjects, manage notes, set reminders and study
              smarter with one modern platform.
            </p>
          </div>
            <div>

            <h3 className="text-xl font-semibold dark:text-white mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-600 dark:text-gray-400">

              <li>
                <Link
                  to="home"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="cursor-pointer hover:text-blue-600 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="features"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="cursor-pointer hover:text-blue-600 transition"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  to="faq"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="cursor-pointer hover:text-blue-600 transition"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className="hover:text-blue-600 transition"
                >
                  Login
                </NavLink>
              </li>

            </ul>

          </div>

      

          <div>

            <h3 className="text-xl font-semibold dark:text-white mb-5">
              Contact
            </h3>

            <div className="space-y-3 text-gray-600 dark:text-gray-400">

              <p>support@OrganizeNotes.com</p>

              <p> Pune, India</p>

              <p> Built for Students</p>

            </div>

          </div>

        </div>

       

        <div className="border-t border-gray-200 dark:border-slate-800 mt-10 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">

            <p className="text-gray-500 dark:text-gray-400 text-center md:text-left">
              © 2026 OrganizeNotes. All Rights Reserved.
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;