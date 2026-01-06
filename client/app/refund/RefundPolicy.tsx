import React from "react";
import { styles } from "../styles/style";

type Props = {};

const RefundPolicy = (props: Props) => {
  return (
    <div className="min-h-screen">
      <div className={"w-[95%] 800px:w-[85%] m-auto py-8 800px:py-12 text-black dark:text-white px-3"}>
        <h1 className={`${styles.title} !text-start pt-2`}>
          Cancellation & Refund Policy
        </h1>
        
        <div className="mt-6 space-y-6">
          <section>
            <p className="text-[15px] font-Poppins leading-7 mb-4">
              <strong>Last updated:</strong> December 05, 2025
            </p>
            <p className="text-[15px] font-Poppins leading-7">
              Thank you for choosing BBEdits for your learning journey. At BBEdits, we strive to provide our students with the best possible learning experience. We understand that circumstances may change, and you may need to cancel your enrollment or request a refund. Our cancellation and refund policy is designed to be clear and fair for all parties.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-4">
              If, for any reason, you are not completely satisfied with a purchase, we invite you to review our policy on refunds and returns below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Interpretation and Definitions</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Interpretation</h3>
            <p className="text-[15px] font-Poppins leading-7">
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Definitions</h3>
            <p className="text-[15px] font-Poppins leading-7 mb-2">For the purposes of this Cancellation and Refund Policy:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[15px] font-Poppins leading-7">
                <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to BBEdits.
              </li>
              <li className="text-[15px] font-Poppins leading-7">
                <strong>Courses</strong> or <strong>Goods</strong> refer to the online courses, learning materials, and educational content offered for sale on the Service.
              </li>
              <li className="text-[15px] font-Poppins leading-7">
                <strong>Orders</strong> mean a request by You to purchase Courses from Us.
              </li>
              <li className="text-[15px] font-Poppins leading-7">
                <strong>Service</strong> refers to the Website and learning platform.
              </li>
              <li className="text-[15px] font-Poppins leading-7">
                <strong>Website</strong> refers to BBEdits, accessible from the platform.
              </li>
              <li className="text-[15px] font-Poppins leading-7">
                <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Cancellation Policy</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">1.1. Before Course Access</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Cancellations can be made within <strong>7 days</strong> of purchase if you have not accessed any course content, materials, or resources for a full refund.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              To cancel your enrollment, please contact us at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a> or <a href="mailto:contact@bbedits.in" className="text-blue-600 dark:text-blue-400">contact@bbedits.in</a> with your order details and course information.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">1.2. After Course Content Access</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Once you have accessed the course content (including video lessons, downloadable materials, quizzes, or any other course resources), cancellations are no longer eligible for a refund.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              Accessing course content includes, but is not limited to:
            </p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li className="text-[15px] font-Poppins leading-7">Watching any video lecture</li>
              <li className="text-[15px] font-Poppins leading-7">Downloading course materials</li>
              <li className="text-[15px] font-Poppins leading-7">Participating in discussions or forums</li>
              <li className="text-[15px] font-Poppins leading-7">Taking quizzes or assessments</li>
              <li className="text-[15px] font-Poppins leading-7">Accessing any interactive content</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">1.3. Live Sessions and Webinars</h3>
            <p className="text-[15px] font-Poppins leading-7">
              For courses that include live sessions, participation in any live session will be considered as usage of the course. After joining any live session, no cancellations or refunds will be issued.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">1.4. Non-Refundable Courses</h3>
            <p className="text-[15px] font-Poppins leading-7">
              The following courses are non-refundable and non-cancellable once the purchase has been completed:
            </p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li className="text-[15px] font-Poppins leading-7">Courses purchased during special promotions or flash sales</li>
              <li className="text-[15px] font-Poppins leading-7">Discounted packages or bundle courses</li>
              <li className="text-[15px] font-Poppins leading-7">Courses purchased with promotional codes or coupons</li>
              <li className="text-[15px] font-Poppins leading-7">Lifetime access courses on sale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Refund Policy</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">2.1. Eligibility for Refunds</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Full refunds will be granted for cancellations made within 7 days of purchase, provided:
            </p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li className="text-[15px] font-Poppins leading-7">The course materials have not been accessed</li>
              <li className="text-[15px] font-Poppins leading-7">No video content has been viewed</li>
              <li className="text-[15px] font-Poppins leading-7">The course is in its original, unaccessed state</li>
            </ul>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              Refunds for eligible cancellations will be processed to the original payment method within <strong>7-10 business days</strong> after confirmation.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.2. Course Cancellations by BBEdits</h3>
            <p className="text-[15px] font-Poppins leading-7">
              If BBEdits cancels a course due to unforeseen circumstances (such as instructor unavailability, technical issues, or insufficient enrollment), students will receive:
            </p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li className="text-[15px] font-Poppins leading-7">A full refund of the course fees, OR</li>
              <li className="text-[15px] font-Poppins leading-7">The option to enroll in another course of equal or greater value</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.3. Non-Refundable Circumstances</h3>
            <p className="text-[15px] font-Poppins leading-7 mb-2">No refunds will be provided for:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li className="text-[15px] font-Poppins leading-7">Partially completed courses</li>
              <li className="text-[15px] font-Poppins leading-7">Courses that have been accessed or materials downloaded</li>
              <li className="text-[15px] font-Poppins leading-7">Live sessions that have been attended</li>
              <li className="text-[15px] font-Poppins leading-7">Change of mind after accessing course content</li>
              <li className="text-[15px] font-Poppins leading-7">Technical issues on the student's end (internet connectivity, device compatibility, etc.)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.4. Processing Fees and Charges</h3>
            <p className="text-[15px] font-Poppins leading-7">
              Any additional costs related to payment gateway charges, transaction fees, bank charges, or taxes incurred during the payment process are non-refundable. These fees are deducted by third-party payment processors and are beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Conditions for Returns</h2>
            <p className="text-[15px] font-Poppins leading-7 mb-2">In order for the Course to be eligible for a return, please make sure that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[15px] font-Poppins leading-7">The Course was purchased in the last 7 days</li>
              <li className="text-[15px] font-Poppins leading-7">The Course content has not been accessed or viewed</li>
              <li className="text-[15px] font-Poppins leading-7">No downloadable materials have been downloaded</li>
              <li className="text-[15px] font-Poppins leading-7">No certificates have been issued</li>
            </ul>

            <p className="text-[15px] font-Poppins leading-7 mt-4 mb-2">The following Courses cannot be returned:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-[15px] font-Poppins leading-7">Courses purchased more than 7 days ago</li>
              <li className="text-[15px] font-Poppins leading-7">Courses where content has been accessed, viewed, or downloaded</li>
              <li className="text-[15px] font-Poppins leading-7">Customized or personalized course content</li>
              <li className="text-[15px] font-Poppins leading-7">Courses purchased during promotional sales (unless required by applicable law)</li>
            </ul>

            <p className="text-[15px] font-Poppins leading-7 mt-4">
              We reserve the right to refuse returns of any Course that does not meet the above return conditions in our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Process for Requesting Cancellations or Refunds</h2>
            <p className="text-[15px] font-Poppins leading-7 mb-3">
              To request a cancellation or refund, please follow these steps:
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg space-y-3">
              <div>
                <p className="text-[15px] font-Poppins leading-7">
                  <strong>Step 1:</strong> Contact us via email at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a> with the subject line "Cancellation/Refund Request."
                </p>
              </div>
              <div>
                <p className="text-[15px] font-Poppins leading-7">
                  <strong>Step 2:</strong> Provide your order number, course name, purchase date, and reason for cancellation or refund.
                </p>
              </div>
              <div>
                <p className="text-[15px] font-Poppins leading-7">
                  <strong>Step 3:</strong> Our support team will review your request and respond within 2-3 business days with confirmation and next steps.
                </p>
              </div>
              <div>
                <p className="text-[15px] font-Poppins leading-7">
                  <strong>Step 4:</strong> Once approved, refunds will be processed within 7-10 business days to your original payment method.
                </p>
              </div>
            </div>

            <p className="text-[15px] font-Poppins leading-7 mt-4">
              Please note: We cannot process refunds without proper verification of your purchase and confirmation that the eligibility criteria are met.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Gift Purchases</h2>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Courses Purchased as Gifts</h3>
            <p className="text-[15px] font-Poppins leading-7">
              If the Course was purchased as a gift and then sent directly to the recipient, the gift recipient will receive a gift credit for the value of their return (if eligible). Once the return is approved, a gift certificate or credit will be issued.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              If the Course wasn't marked as a gift when purchased, or the gift giver purchased the course for themselves to give later, we will send the refund to the original purchaser (gift giver).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Subscription Refunds</h2>
            <p className="text-[15px] font-Poppins leading-7">
              For subscription-based access to multiple courses:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li className="text-[15px] font-Poppins leading-7">Refunds are only available within 7 days of the initial subscription purchase if no content has been accessed</li>
              <li className="text-[15px] font-Poppins leading-7">Recurring subscription charges are non-refundable</li>
              <li className="text-[15px] font-Poppins leading-7">You may cancel your subscription at any time, but no refunds will be provided for the current billing period</li>
              <li className="text-[15px] font-Poppins leading-7">Upon cancellation, you will retain access until the end of your current billing period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Technical Issues</h2>
            <p className="text-[15px] font-Poppins leading-7">
              If you experience technical issues that prevent you from accessing your purchased course, please contact our support team immediately at <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400">support@bbedits.in</a>. We will work to resolve the issue promptly.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              Technical issues on our platform that are unresolved within a reasonable timeframe may qualify for a refund on a case-by-case basis, at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Policy Modifications</h2>
            <p className="text-[15px] font-Poppins leading-7">
              BBEdits reserves the right to modify or update this Cancellation and Refund Policy at any time. Any changes will be posted on this page with an updated "Last updated" date and will be effective immediately upon posting.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              We encourage you to review this policy periodically to stay informed about our refund and cancellation procedures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Dispute Resolution</h2>
            <p className="text-[15px] font-Poppins leading-7">
              If you have a dispute regarding a refund or cancellation, please contact us first to attempt to resolve the issue informally. We are committed to working with our students to find fair solutions.
            </p>
            <p className="text-[15px] font-Poppins leading-7 mt-3">
              All disputes will be handled in accordance with the laws of India and the jurisdiction of Vizag, India, as specified in our Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-[15px] font-Poppins leading-7 mb-3">
              If you have any questions about our Cancellation and Refund Policy, require further assistance, or need to submit a refund request, please contact us at:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-5 rounded space-y-2">
              <p className="text-[15px] font-Poppins leading-7">
                <strong>BBEdits Support Team</strong>
              </p>
              <p className="text-[15px] font-Poppins leading-7">
                📧 Email: <a href="mailto:support@bbedits.in" className="text-blue-600 dark:text-blue-400 font-semibold">support@bbedits.in</a>
              </p>
              <p className="text-[15px] font-Poppins leading-7">
                📧 Email: <a href="mailto:contact@bbedits.in" className="text-blue-600 dark:text-blue-400 font-semibold">contact@bbedits.in</a>
              </p>
              <p className="text-[15px] font-Poppins leading-7">
                📞 Phone: <a href="tel:+919515595970" className="text-blue-600 dark:text-blue-400 font-semibold">+91 9515595970</a>
              </p>
              <p className="text-[15px] font-Poppins leading-7">
                📍 Location: Vizag, India
              </p>
              <p className="text-[15px] font-Poppins leading-7 mt-3">
                <strong>Response Time:</strong> We typically respond to all inquiries within 2-3 business days.
              </p>
            </div>
          </section>

          <section className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 p-5 rounded">
              <p className="text-[15px] font-Poppins leading-7">
                <strong>Important Note:</strong> This policy is designed to provide clarity and ensure a smooth experience for our students. By purchasing a course on BBEdits, you acknowledge that you have read, understood, and agree to this Cancellation and Refund Policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
