import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="min-h-screen pt-44">
      <div className={"w-[95%] 800px:w-[85%] m-auto py-8 800px:py-12 text-black dark:text-white px-3"}>
        <h1 className={`${styles.title} !text-start pt-2`}>
          Terms & Conditions
        </h1>
        
        <div className="mt-6 space-y-6">
          <section>
            <p className="text-[16px] font-Poppins leading-7">
              These Terms & Conditions ("Legal Terms") constitute a legally binding agreement made between you ("you"), whether personally or on behalf of an entity, and BBEDITS, concerning your access to and use of our services, products, and website.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-4">
              By accessing or using the Services, you acknowledge that you have read, understood, and agreed to be bound by these Legal Terms. IF YOU DO NOT AGREE, PLEASE DO NOT USE THE SERVICES.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-4">
              We recommend that you keep a printed or digital copy of these Legal Terms for your records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. OUR SERVICES</h2>
            <p className="text-[16px] font-Poppins leading-7">
              The Services are not intended for use in jurisdictions where such access would violate applicable laws. Users accessing the Services from outside India do so at their own risk and are responsible for compliance with local laws.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              The Services are not designed to comply with industry-specific regulations such as HIPAA, FISMA, etc. If your activities fall under such regulations, you may not use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. INTELLECTUAL PROPERTY RIGHTS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              All source code, features, software, designs, text, graphics, photos, audio, video, and trademarks available through the Services (collectively "Content") are owned or licensed by BBEDITS and protected by applicable copyright and trademark laws.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              You are granted a limited, revocable, non-transferable license to access and use the Services for personal and non-commercial use only.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              You may not copy, modify, reproduce, resell, distribute, or publicly display any Content without written permission from BBEDITS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. USER REPRESENTATIONS</h2>
            <p className="text-[16px] font-Poppins leading-7 mb-2">By using the Services, you warrant that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[16px] font-Poppins leading-7">You are legally competent to agree to these terms.</li>
              <li className="text-[16px] font-Poppins leading-7">Information you submit during registration is true and accurate.</li>
              <li className="text-[16px] font-Poppins leading-7">You will not use automated tools to access the Services.</li>
              <li className="text-[16px] font-Poppins leading-7">You will not engage in any activity that violates laws or these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. USER REGISTRATION</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Users may be required to create an account. You are responsible for maintaining the confidentiality of your login information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. PRODUCTS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              All products/services are subject to availability. We reserve the right to modify or discontinue any product or pricing without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. PURCHASES & PAYMENT</h2>
            <p className="text-[16px] font-Poppins leading-7 mb-2">We accept:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">Visa</li>
              <li className="text-[16px] font-Poppins leading-7">Mastercard</li>
              <li className="text-[16px] font-Poppins leading-7">American Express</li>
              <li className="text-[16px] font-Poppins leading-7">PayPal</li>
              <li className="text-[16px] font-Poppins leading-7">UPI/Debit/Credit (if applicable)</li>
            </ul>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              All pricing is in Indian Rupees (INR).
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              You authorize BBEDITS to charge your selected payment method for all purchases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. SUBSCRIPTIONS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Subscriptions renew automatically unless cancelled. Cancellation will apply at the end of the billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. REFUND POLICY</h2>
            <p className="text-[16px] font-Poppins leading-7">
              All sales are final and non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. PROHIBITED ACTIVITIES</h2>
            <p className="text-[16px] font-Poppins leading-7 mb-2">You agree NOT to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[16px] font-Poppins leading-7">Steal or misuse any user information</li>
              <li className="text-[16px] font-Poppins leading-7">Copy or modify the Services</li>
              <li className="text-[16px] font-Poppins leading-7">Upload malware</li>
              <li className="text-[16px] font-Poppins leading-7">Harass or abuse other users</li>
              <li className="text-[16px] font-Poppins leading-7">Engage in illegal or exploitative activities</li>
              <li className="text-[16px] font-Poppins leading-7">Compete against BBEDITS using our intellectual property</li>
            </ul>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              Violation may result in a permanent ban and legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. USER CONTRIBUTIONS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              If you post content on the platform (reviews, comments, uploads), you grant BBEDITS a perpetual worldwide license to use, reproduce, modify, and display such content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. CONTRIBUTION LICENSE</h2>
            <p className="text-[16px] font-Poppins leading-7">
              You retain ownership of your content, but by uploading you grant us full usage rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. GUIDELINES FOR REVIEWS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Reviews must not be misleading, offensive, abusive, discriminatory, or contain illegal content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. SOCIAL MEDIA</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Users may link third-party social accounts to their BBEDITS account. BBEDITS is not responsible for third-party platform content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. SERVICES MANAGEMENT</h2>
            <p className="text-[16px] font-Poppins leading-7">
              We may monitor platform behavior and restrict accounts violating these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">15. PRIVACY POLICY</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Use of BBEDITS indicates full acceptance of our Privacy Policy (provided below).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">16. TERMINATION</h2>
            <p className="text-[16px] font-Poppins leading-7">
              BBEDITS may terminate or suspend your account without notice for violating these Legal Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">17. MODIFICATIONS & INTERRUPTIONS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Service outages or updates may occur. BBEDITS is not liable for downtime.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">18. GOVERNING LAW</h2>
            <p className="text-[16px] font-Poppins leading-7">
              These Terms are governed by the laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">19. DISPUTE RESOLUTION</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Arbitration seat: Vizag, India<br />
              Arbitration language: Telugu
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">28. CONTACT US</h2>
            <div className="text-[16px] font-Poppins leading-7 space-y-1">
              <p><strong>BBEDITS</strong></p>
              <p>📧 support@bbedits.in</p>
              <p>📧 contact@bbedits.in</p>
              <p>📞 +91 9515595970</p>
              <p>📍 Vizag, India</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">29. WHATSAPP COMMUNICATION CONSENT</h2>
            <p className="text-[16px] font-Poppins leading-7">
              By providing your number, you consent to receiving updates and service messages via WhatsApp from BBEDITS. You may withdraw consent anytime by messaging or emailing support@bbedits.in.
            </p>
          </section>

          {/* Privacy Policy Section */}
          <section className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
            <h1 className="text-2xl font-bold mb-4">🔐 PRIVACY POLICY – BBEDITS</h1>
            <p className="text-[16px] font-Poppins leading-7 mb-4">
              <strong>Last Updated:</strong> 05 December 2025
            </p>
            <p className="text-[16px] font-Poppins leading-7 mb-4">
              This Privacy Policy explains how BBEDITS collects, uses, discloses, and safeguards your information when you access our website and services.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mb-6">
              By using the Services, you consent to the data practices described in this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold mb-3">1. INFORMATION WE COLLECT</h2>
            <p className="text-[16px] font-Poppins leading-7 mb-2">We may collect:</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">1. Personal Information</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">Name</li>
              <li className="text-[16px] font-Poppins leading-7">Email address</li>
              <li className="text-[16px] font-Poppins leading-7">Phone number</li>
              <li className="text-[16px] font-Poppins leading-7">Billing details</li>
              <li className="text-[16px] font-Poppins leading-7">Social media usernames (if linked)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2. Technical Information</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">IP address</li>
              <li className="text-[16px] font-Poppins leading-7">Device/browser details</li>
              <li className="text-[16px] font-Poppins leading-7">Cookies and usage analytics</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">3. Transaction Data</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">Purchase history</li>
              <li className="text-[16px] font-Poppins leading-7">Payment method details (processed securely by payment gateways)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. HOW WE USE YOUR INFORMATION</h2>
            <p className="text-[16px] font-Poppins leading-7 mb-2">We use your information to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">Deliver products/services</li>
              <li className="text-[16px] font-Poppins leading-7">Create and manage user accounts</li>
              <li className="text-[16px] font-Poppins leading-7">Provide customer support</li>
              <li className="text-[16px] font-Poppins leading-7">Send updates regarding services</li>
              <li className="text-[16px] font-Poppins leading-7">Process payments</li>
              <li className="text-[16px] font-Poppins leading-7">Improve website performance and security</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. DATA SHARING</h2>
            <p className="text-[16px] font-Poppins leading-7">
              We DO NOT sell your personal data.
            </p>
            <p className="text-[16px] font-Poppins leading-7 mt-3 mb-2">We may share data only with:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">Payment processors</li>
              <li className="text-[16px] font-Poppins leading-7">Service providers necessary to operate the platform</li>
              <li className="text-[16px] font-Poppins leading-7">Legal authorities when required by law</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. DATA SECURITY</h2>
            <p className="text-[16px] font-Poppins leading-7">
              BBEDITS uses encryption and security protocols to protect stored information. However, no online system is 100% secure.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. DATA RETENTION</h2>
            <p className="text-[16px] font-Poppins leading-7">
              We retain user data as long as necessary to provide services and comply with law.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. YOUR RIGHTS</h2>
            <p className="text-[16px] font-Poppins leading-7 mb-2">Users may request:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[16px] font-Poppins leading-7">Access to their data</li>
              <li className="text-[16px] font-Poppins leading-7">Correction of inaccurate data</li>
              <li className="text-[16px] font-Poppins leading-7">Deletion of account</li>
            </ul>
            <p className="text-[16px] font-Poppins leading-7 mt-3">
              Request by emailing support@bbedits.in.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. COOKIES</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Our website uses cookies to enhance user experience and track usage analytics.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. MINORS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Users under 18 must use the Services under parental supervision.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. THIRD-PARTY LINKS</h2>
            <p className="text-[16px] font-Poppins leading-7">
              BBEDITS is not responsible for privacy practices of external websites.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">10. CHANGES TO THIS POLICY</h2>
            <p className="text-[16px] font-Poppins leading-7">
              The Privacy Policy may be updated occasionally. Continued use means you accept the updated version.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">11. CONTACT REGARDING PRIVACY</h2>
            <p className="text-[16px] font-Poppins leading-7">
              Questions about privacy can be directed to:<br />
              📧 support@bbedits.in
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Policy;
