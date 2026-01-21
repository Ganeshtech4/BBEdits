import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Terms = (props: Props) => {
  return (
    <div className="min-h-screen pt-44">
      <div className={"w-[95%] 800px:w-[85%] m-auto py-8 800px:py-12 text-black dark:text-white px-3"}>
        <h1 className={`${styles.title} !text-start pt-2`}>
          Terms & Conditions
        </h1>
        
        <div className="mt-6 space-y-6">
          <section>
            <p className="text-[15px] font-Poppins leading-7">
              These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and BBEdits, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-4">
              We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms will become effective upon posting or notifying you by <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a>. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-4">
              We recommend that you print a copy of these Legal Terms for your records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. OUR SERVICES</h2>
            <p className="text-[15px] font-Poppins leading-7">
              The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation. Those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              The Services are not tailored to comply with industry-specific regulations (HIPAA, FISMA, etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. INTELLECTUAL PROPERTY RIGHTS</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Our Intellectual Property</h3>
            <p className="text-[15px] font-Poppins leading-7">
              We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              Our Content and Marks are protected by copyright and trademark laws and treaties in India and around the world. The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Your Use of Our Services</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access, solely for your personal, non-commercial use.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              If you wish to make any use of the Services, Content, or Marks other than as set out in this section, please contact us at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a> or <a href="tel:+919515595970" className="text-blue-600 dark:text-blue-400">+91 9515595970</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. USER REPRESENTATIONS</h2>
            <p className="text-[15px] font-Poppins leading-7 mb-2">By using the Services, you represent and warrant that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[15px] font-Poppins leading-7">All registration information you submit will be true, accurate, current, and complete</li>
              <li className="text-[15px] font-Poppins leading-7">You will maintain the accuracy of such information</li>
              <li className="text-[15px] font-Poppins leading-7">You have the legal capacity to comply with these Legal Terms</li>
              <li className="text-[15px] font-Poppins leading-7">You are not a minor, or if a minor, you have received parental permission</li>
              <li className="text-[15px] font-Poppins leading-7">You will not access the Services through automated or non-human means</li>
              <li className="text-[15px] font-Poppins leading-7">You will not use the Services for any illegal or unauthorized purpose</li>
              <li className="text-[15px] font-Poppins leading-7">Your use will not violate any applicable law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. USER REGISTRATION</h2>
            <p className="text-[15px] font-Poppins leading-7">
              You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine it is inappropriate, obscene, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. PRODUCTS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. PURCHASES AND PAYMENT</h2>
            <p className="text-[15px] font-Poppins leading-7 mb-2">We accept the following forms of payment:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[15px] font-Poppins leading-7">Visa</li>
              <li className="text-[15px] font-Poppins leading-7">Mastercard</li>
              <li className="text-[15px] font-Poppins leading-7">American Express</li>
              <li className="text-[15px] font-Poppins leading-7">PayPal</li>
              <li className="text-[15px] font-Poppins leading-7">UPI/Debit/Credit Cards</li>
            </ul>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              All payments shall be in Indian Rupees (INR). You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. SUBSCRIPTIONS</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Billing and Renewal</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Your subscription will continue and automatically renew unless canceled. You consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge.
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Cancellation</h3>
            <p className="text-[15px] font-Poppins leading-7">
              You can cancel your subscription at any time by contacting us at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a>. Your cancellation will take effect at the end of the current paid term.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. REFUNDS POLICY</h2>
            <p className="text-[15px] font-Poppins leading-7">
              All sales are final and no refund will be issued.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. PROHIBITED ACTIVITIES</h2>
            <p className="text-[15px] font-Poppins leading-7 mb-2">As a user of the Services, you agree not to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[15px] font-Poppins leading-7">Systematically retrieve data from the Services to create compilations without written permission</li>
              <li className="text-[15px] font-Poppins leading-7">Trick, defraud, or mislead us and other users</li>
              <li className="text-[15px] font-Poppins leading-7">Circumvent security-related features of the Services</li>
              <li className="text-[15px] font-Poppins leading-7">Disparage, tarnish, or otherwise harm us and/or the Services</li>
              <li className="text-[15px] font-Poppins leading-7">Use information obtained from the Services to harass, abuse, or harm another person</li>
              <li className="text-[15px] font-Poppins leading-7">Upload or transmit viruses, Trojan horses, or other malicious material</li>
              <li className="text-[15px] font-Poppins leading-7">Engage in any automated use of the system</li>
              <li className="text-[15px] font-Poppins leading-7">Copy or adapt the Services' software</li>
              <li className="text-[15px] font-Poppins leading-7">Decipher, decompile, disassemble, or reverse engineer any software</li>
              <li className="text-[15px] font-Poppins leading-7">Use the Services to compete with us or for any revenue-generating endeavor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. USER GENERATED CONTRIBUTIONS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality. When you create or make available any Contributions, you represent and warrant that your content does not infringe third-party rights, is accurate, and complies with all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. CONTRIBUTION LICENSE</h2>
            <p className="text-[15px] font-Poppins leading-7">
              By posting Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to use, copy, reproduce, distribute, and display such Contributions for any purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. GUIDELINES FOR REVIEWS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              Reviews must be based on firsthand experience and must not contain offensive profanity, abusive, racist, hateful language, or discriminatory references. You may not post false or misleading statements or organize campaigns to post reviews.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. SOCIAL MEDIA</h2>
            <p className="text-[15px] font-Poppins leading-7">
              You may link your account with third-party social media accounts. We may access and store Social Network Content made available through your Third-Party Account. Your relationship with third-party service providers is governed solely by your agreement with them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. SERVICES MANAGEMENT</h2>
            <p className="text-[15px] font-Poppins leading-7">
              We reserve the right to monitor the Services for violations, take appropriate legal action, refuse or restrict access, and remove excessive files and content that are burdensome to our systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">15. PRIVACY POLICY</h2>
            <p className="text-[15px] font-Poppins leading-7">
              We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy. Please be advised the Services are hosted in India. If you access the Services from other regions, you consent to have your data transferred to and processed in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">16. TERM AND TERMINATION</h2>
            <p className="text-[15px] font-Poppins leading-7">
              These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right to deny access, terminate your use, or delete your account at any time without warning, for any reason or for no reason, including for breach of these Legal Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">17. MODIFICATIONS AND INTERRUPTIONS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              We reserve the right to change, modify, or remove the contents of the Services at any time without notice. We cannot guarantee the Services will be available at all times. You agree that we have no liability for any loss, damage, or inconvenience caused by your inability to access or use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">18. GOVERNING LAW</h2>
            <p className="text-[15px] font-Poppins leading-7">
              These Legal Terms shall be governed by and defined following the laws of India. BBEdits and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">19. DISPUTE RESOLUTION</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Informal Negotiations</h3>
            <p className="text-[15px] font-Poppins leading-7">
              The Parties agree to first attempt to negotiate any Dispute informally for at least fifteen (15) days before initiating arbitration.
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Binding Arbitration</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Any dispute shall be finally resolved by arbitration. The number of arbitrators shall be three (3). The seat of arbitration shall be Vizag, India. The language of the proceedings shall be English/Telugu. The governing law shall be substantive law of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">20. CORRECTIONS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time, without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">21. DISCLAIMER</h2>
            <p className="text-[15px] font-Poppins leading-7">
              THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">22. LIMITATIONS OF LIABILITY</h2>
            <p className="text-[15px] font-Poppins leading-7">
              IN NO EVENT WILL WE BE LIABLE FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES. OUR LIABILITY WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">23. INDEMNIFICATION</h2>
            <p className="text-[15px] font-Poppins leading-7">
              You agree to defend, indemnify, and hold us harmless from and against any loss, damage, liability, claim, or demand made by any third party due to or arising out of your use of the Services, breach of these Legal Terms, or violation of the rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">24. USER DATA</h2>
            <p className="text-[15px] font-Poppins leading-7">
              We will maintain certain data that you transmit to the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit. You agree that we shall have no liability to you for any loss or corruption of any such data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">25. ELECTRONIC COMMUNICATIONS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and agree that all communications we provide electronically satisfy any legal requirement that such communication be in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">26. MISCELLANEOUS</h2>
            <p className="text-[15px] font-Poppins leading-7">
              These Legal Terms constitute the entire agreement between you and us. Our failure to exercise any right or provision shall not operate as a waiver. If any provision is determined to be unlawful or unenforceable, that provision is deemed severable and does not affect the validity of remaining provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">27. USE OF WHATSAPP SERVICES</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Purpose of Communication</h3>
            <p className="text-[15px] font-Poppins leading-7">
              By providing your phone number during registration or checkout, you agree that we may use WhatsApp to contact you regarding:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li className="text-[15px] font-Poppins leading-7">Updates related to your orders, services, or courses</li>
              <li className="text-[15px] font-Poppins leading-7">Important announcements, such as system maintenance or policy updates</li>
              <li className="text-[15px] font-Poppins leading-7">Support and issue resolution related to your account or purchases</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Consent for Communication</h3>
            <p className="text-[15px] font-Poppins leading-7">
              By opting in to WhatsApp communications, you acknowledge that we may send messages to the WhatsApp number associated with your account. Consent is voluntary, and you may withdraw at any time by contacting us at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a>.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Data Usage and Privacy</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Your phone number and related information will only be used to facilitate communication through WhatsApp and will not be shared with third parties except as required to deliver the service.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Withdrawal of Consent</h3>
            <p className="text-[15px] font-Poppins leading-7">
              You may withdraw your consent to receive WhatsApp communications at any time by unsubscribing through a message sent via WhatsApp or by contacting us at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">28. CONTACT US</h2>
            <div className="text-[15px] font-Poppins leading-7 space-y-1">
              <p><strong>BBEdits</strong></p>
              <p>📧 <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a></p>
              <p>📧 <a href="mailto:contact@bbedits.in" className="text-blue-600 dark:text-blue-400">contact@bbedits.in</a></p>
              <p>📞 <a href="tel:+919515595970" className="text-blue-600 dark:text-blue-400">+91 9515595970</a></p>
              <p>📍 Vizag, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
