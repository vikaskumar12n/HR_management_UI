import 'react';
import { FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-4">HRMS Pro</h5>
            <p className="text-white-50 mb-4">
              Comprehensive Human Resource Management System for modern businesses.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white fs-5"><FaLinkedin /></a>
              <a href="#" className="text-white fs-5"><FaTwitter /></a>
              <a href="#" className="text-white fs-5"><FaEnvelope /></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="#" className="text-white-50 text-decoration-none">Home</a></li>
              <li className="mb-3"><a href="#" className="text-white-50 text-decoration-none">Features</a></li>
              <li className="mb-3"><a href="#" className="text-white-50 text-decoration-none">Pricing</a></li>
              <li><a href="#" className="text-white-50 text-decoration-none">About Us</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-4">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="#" className="text-white-50 text-decoration-none">Help Center</a></li>
              <li className="mb-3"><a href="#" className="text-white-50 text-decoration-none">Documentation</a></li>
              <li className="mb-3"><a href="#" className="text-white-50 text-decoration-none">Community</a></li>
              <li><a href="#" className="text-white-50 text-decoration-none">Status</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-4">Contact</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-3 d-flex align-items-start gap-2">
                <FaEnvelope className="mt-1" /> hrms@example.com
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <FaPhone /> +1 (555) 123-4567
              </li>
              <li className="d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="mt-1" />
                <span>123 Business Ave, Suite 100<br />San Francisco, CA 94107</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="text-white-50 mb-3 mb-md-0">
            &copy; {new Date().getFullYear()} HRMS Pro. All rights reserved.
          </p>
          <div>
            <a href="#" className="text-white-50 text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="text-white-50 text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;