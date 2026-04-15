import Logo from "./Logo";

const legalStyles = {
  wrapper: {
    background: "var(--bg)", color: "#cbd5e1", fontFamily: "var(--font)",
    minHeight: "100vh", position: "relative"
  },
  header: {
    maxWidth: 800, margin: "0 auto", padding: "40px 24px 0",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  },
  backBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontSize: 13,
    fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s"
  },
  content: {
    maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px",
    lineHeight: 1.75, fontSize: 14
  },
  h1: {
    color: "#f1f5f9", fontSize: 32, fontWeight: 700, marginBottom: 8
  },
  h2: {
    color: "#e2e8f0", fontSize: 18, fontWeight: 700, marginTop: 36, marginBottom: 12
  },
  p: {
    marginBottom: 16, color: "#94a3b8"
  },
  strong: {
    color: "#cbd5e1", fontWeight: 600
  },
  caps: {
    marginBottom: 16, color: "#94a3b8", textTransform: "uppercase", fontSize: 13
  },
  link: {
    color: "var(--amber)", textDecoration: "none"
  },
  footer: {
    maxWidth: 800, margin: "0 auto", padding: "32px 24px",
    borderTop: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
  }
};

export default function TermsOfService({ onBack }) {
  return (
    <div style={legalStyles.wrapper}>
      <div style={legalStyles.header}>
        <Logo size={26} />
        <button style={legalStyles.backBtn} onClick={onBack}>← Back</button>
      </div>

      <div style={legalStyles.content}>
        <h1 style={legalStyles.h1}>Terms of Service</h1>
        <p style={{ ...legalStyles.p, color: "#64748b", fontSize: 13, marginBottom: 32 }}>
          <strong style={legalStyles.strong}>WiseCorp LLC</strong> — Last Updated: April 14, 2026
        </p>

        <p style={legalStyles.p}>
          Welcome to LotDuel! We are an online platform that helps car buyers collect and compare out-the-door (OTD) quotes from multiple dealerships. These Terms of Use ("Terms of Use" or "Terms") govern your use of LotDuel, a website owned by WiseCorp LLC ("LotDuel," "Company," "We," "Our"), which also includes all related tools, data, software, and other services provided by us (the "Services").
        </p>

        <p style={legalStyles.p}>
          This document, together with our Privacy Policy and any other terms specifically referred to therein, constitute a legally binding agreement (the "Agreement") between you and the Company in relation to your use of our Services. If you do not agree with these Terms, do not use LotDuel's Services.
        </p>

        <h2 style={legalStyles.h2}>Acceptance of Terms of Use</h2>
        <p style={legalStyles.p}>
          Please read these Terms of Use, and our Privacy Policy, very carefully. By registering with our Services, you agree to be legally bound by all the terms and conditions herein. Your acceptance of these Terms of Use creates a legally binding contract between you and the Company. If you do not agree with any aspect of these Terms of Use, then do not use the Services. By accepting the Terms of Use and creating an account, you represent and warrant that the information you include on the Services is accurate, you are eighteen years of age or older, and that you have the capacity to enter into and abide by these Terms.
        </p>

        <h2 style={legalStyles.h2}>Changes to Terms of Use</h2>
        <p style={legalStyles.p}>
          We reserve the right to change, alter, replace, or otherwise modify these Terms of Use at any time. The date of last modification is stated at the end of these Terms of Use. When we make any updates to these Terms of Use, we will highlight this fact on the website. In addition, if you register an account and these Terms of Use are subsequently changed in any material respect, we will notify you through a message or by sending an email to the email address that you have provided to us. Your continued use of the Services will constitute your acceptance of the revised Terms of Use.
        </p>

        <h2 style={legalStyles.h2}>Your LotDuel Account</h2>
        <p style={legalStyles.p}>
          When you first create a LotDuel account, we ask that you register by providing your name and email address. Access to certain features of the Services is only available to registered users who have expressly agreed to these Terms of Use and our Privacy Policy.
        </p>
        <p style={legalStyles.p}>
          You are solely responsible for maintaining the confidentiality and security of your login and account information, and you will remain responsible for all activity emanating from your account, whether or not such activity was authorized by you.
        </p>
        <p style={legalStyles.p}>
          We reserve the right to disallow, cancel, remove, or reassign certain usernames in appropriate circumstances, as determined by us in our sole discretion, and may, with or without prior notice, suspend, terminate, and delete your account if activities occur on that account which, in our sole discretion, would or might constitute a violation of these Terms of Use or an infringement or violation of the rights of any third party, or of any applicable laws or regulations. You may terminate your account at any time through our Services, or you can contact us at support@lotduel.com.
        </p>

        <h2 style={legalStyles.h2}>Your Use of the Services</h2>
        <p style={legalStyles.p}>
          Subject to your strict compliance with these Terms of Use, LotDuel grants you a limited, personal, non-exclusive, revocable, non-assignable, and non-transferable right and license to use the Services in order to generate, view, share, and download content using the features of the Services where the appropriate functionality has been enabled. The above licenses are conditional upon your strict compliance with these Terms of Use including, without limitation, the following:
        </p>
        <p style={legalStyles.p}>
          (i) You must not copy, rip, or capture, or attempt to copy, rip, or capture, any content from the Services or any part of the Services, other than by means of download or sharing in circumstances where we have elected to permit downloads and sharing of the relevant content.
        </p>
        <p style={legalStyles.p}>
          (ii) You must not employ scraping or similar techniques to aggregate, repurpose, republish, or otherwise make use of any content.
        </p>
        <p style={legalStyles.p}>
          (iii) You must not alter or remove, attempt to alter or remove any trademark, copyright, or other proprietary or legal notices contained in, or appearing on, the Services or any content appearing on the Services.
        </p>
        <p style={legalStyles.p}>
          (iv) You must not, and must not permit any third party to, copy or adapt the object code of the website or any of the Services, or reverse engineer, reverse assemble, decompile, modify, or attempt to discover any source or object code of any part of the Services.
        </p>

        <h2 style={legalStyles.h2}>Dealer Submissions</h2>
        <p style={legalStyles.p}>
          Dealers who submit quotes through the Services represent and warrant that the information provided is accurate and that they have authority to submit such quotes on behalf of their dealership. LotDuel is not responsible for verifying the accuracy of dealer-submitted information. Buyers are encouraged to verify all quotes directly with the dealership before making purchasing decisions.
        </p>

        <h2 style={legalStyles.h2}>No Guarantee of Savings or Outcomes</h2>
        <p style={legalStyles.p}>
          LotDuel is a comparison and leverage tool. We do not guarantee any specific savings, pricing outcomes, or that any dealer will respond to your request. Market conditions, dealer inventory, and pricing vary. The scoring and ranking provided by the Services are based on algorithms and available data and should be used as a reference tool, not as financial or purchasing advice.
        </p>

        <h2 style={legalStyles.h2}>Email and Communication</h2>
        <p style={legalStyles.p}>
          LotDuel generates email templates and dealer invite links for your use. You are responsible for sending these communications from your own email account. LotDuel does not send unsolicited emails to dealerships on your behalf. You agree not to use the email generation features for spam, harassment, or any unlawful purpose.
        </p>

        <h2 style={legalStyles.h2}>Intellectual Property Rights</h2>
        <p style={legalStyles.p}>
          The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by the Company, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
        <p style={legalStyles.p}>
          All related names, logos, product and service names, designs, and slogans are trademarks of the Company or its affiliates or licensors. You must not use such marks without the prior written permission of the Company.
        </p>

        <h2 style={legalStyles.h2}>Third-Party Websites and Services</h2>
        <p style={legalStyles.p}>
          The Services may provide you with access to and/or integration with third-party websites, databases, networks, servers, information, software, programs, systems, directories, applications, products, or services ("External Services"). The Company does not have or maintain any control over External Services and is not and cannot be responsible for their content, operation, or use.
        </p>
        <p style={legalStyles.p}>
          External Services may have their own terms of use and/or privacy policy, and may have different practices and requirements to those operated by the Company. You are solely responsible for reviewing any terms of use, privacy policy, or other terms governing your use of these External Services, which you use at your own risk.
        </p>

        <h2 style={legalStyles.h2}>Disclaimer</h2>
        <p style={legalStyles.caps}>
          THE SERVICES, INCLUDING, WITHOUT LIMITATION, THE WEBSITE AND ALL CONTENT AND SERVICES ACCESSED THROUGH OR VIA THE WEBSITE OR OTHERWISE, ARE PROVIDED "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS."
        </p>
        <p style={legalStyles.caps}>
          YOU AGREE AND ACKNOWLEDGE THAT YOU ASSUME FULL, EXCLUSIVE, AND SOLE RESPONSIBILITY FOR THE USE OF AND RELIANCE ON THE SERVICES, AND YOU FURTHER AGREE AND ACKNOWLEDGE THAT YOUR USE OF OR RELIANCE ON THE SERVICES IS MADE ENTIRELY AT YOUR OWN RISK. YOU FURTHER ACKNOWLEDGE THAT IT IS YOUR RESPONSIBILITY TO COMPLY WITH ALL APPLICABLE LAWS WHILE USING THE SERVICE.
        </p>
        <p style={legalStyles.caps}>
          THE COMPANY MAKES NO PROMISES, GUARANTEES, REPRESENTATIONS, OR WARRANTIES OF ANY KIND WHATSOEVER (EXPRESS OR IMPLIED) REGARDING THE SERVICES, OR ANY PART OR PARTS THEREOF, ANY CONTENT, OR ANY LINKED SERVICES OR OTHER EXTERNAL SERVICES. THE COMPANY DOES NOT WARRANT THAT YOUR USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE, UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR ANY PART OR PARTS THEREOF ARE OR WILL BE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </p>

        <h2 style={legalStyles.h2}>Limitation of Liability</h2>
        <p style={legalStyles.caps}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE COMPANY BE LIABLE FOR DAMAGES OF ANY KIND (INCLUDING, BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, LOST PROFITS, LOST DATA, LOSS OF GOODWILL OR BUSINESS REPUTATION, ANY COST TO PROCURE SUBSTITUTE GOODS OR SERVICES, OR ANY INTANGIBLE LOSS, REGARDLESS OF THE FORESEEABILITY OF THOSE DAMAGES) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE WEBSITE, OR ANY OTHER SERVICES PROVIDED TO YOU BY THE COMPANY.
        </p>
        <p style={legalStyles.caps}>
          THIS LIMITATION SHALL APPLY REGARDLESS OF WHETHER THE DAMAGES ARISE OUT OF BREACH OF CONTRACT, TORT, ANY FORM OF ERROR, OR BREAKDOWN IN THE FUNCTION OF THE SERVICE, OR ANY OTHER LEGAL THEORY OR FORM OF ACTION.
        </p>
        <p style={legalStyles.caps}>
          APPLICABLE LAW MAY NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU.
        </p>

        <h2 style={legalStyles.h2}>Indemnification</h2>
        <p style={legalStyles.p}>
          You hereby agree to indemnify, defend, and hold harmless the Company, its successors, assigns, affiliates, agents, directors, officers, employees, and shareholders from and against any and all claims, obligations, damages, losses, expenses, and costs, including reasonable attorneys' fees, resulting from: (i) any violation by you of these Terms of Use or (ii) any activity related to your account, be it by you or by any other person accessing your account with or without your consent.
        </p>

        <h2 style={legalStyles.h2}>Data Protection, Privacy, and Cookies</h2>
        <p style={legalStyles.p}>
          All personal data that you provide to us in connection with your use of the Services is collected, stored, used, and disclosed by the Company in accordance with our{" "}
          <a href="/privacy" style={legalStyles.link} onClick={(e) => { e.preventDefault(); onBack && window.history.pushState({}, "", "/privacy"); window.dispatchEvent(new PopStateEvent("popstate")); }}>Privacy Policy</a>.
          The Privacy Policy, as may be updated by the Company from time to time, is hereby incorporated into these Terms of Use, and you hereby agree to the collection, use, and disclosure practices set forth therein.
        </p>

        <h2 style={legalStyles.h2}>Applicable Law and Jurisdiction</h2>
        <p style={legalStyles.p}>
          If a dispute arises between you and LotDuel, our goal is to provide you with a neutral and cost-effective means of resolving the issue quickly. In the event of a dispute, we encourage you to contact us first to resolve your problem directly with us.
        </p>
        <p style={legalStyles.p}>
          These Terms of Use shall be construed in accordance with and governed by the laws of the United States and the State of Washington, without reference to their rules regarding conflicts of law.
        </p>

        <h2 style={legalStyles.h2}>Changes to the Services</h2>
        <p style={legalStyles.p}>
          The Company reserves the right at any time and for any reason to suspend, discontinue, terminate, or cease providing access to the Services or any part thereof, temporarily or permanently. You hereby agree that the Company shall not be liable to you or to any third party for any changes or modifications to the website and/or any Services, or for any decision to suspend, discontinue, or terminate the Services.
        </p>

        <h2 style={legalStyles.h2}>Complete Agreement</h2>
        <p style={legalStyles.p}>
          These Terms constitute the entire agreement between you and LotDuel with respect to the use of the LotDuel website and content. Your use of the LotDuel website is also subject to the LotDuel Privacy Policy. If any provision of these Terms is found to be invalid by any court having competent jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions, which shall remain in full force and effect.
        </p>

        <h2 style={legalStyles.h2}>Contact Us</h2>
        <p style={legalStyles.p}>
          For questions or comments about the Terms, please email us at{" "}
          <a href="mailto:support@lotduel.com" style={legalStyles.link}>support@lotduel.com</a>.
        </p>

        <p style={{ ...legalStyles.caps, marginTop: 36, fontWeight: 600, color: "#64748b" }}>
          BY USING OUR WEBSITE OR OTHER SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF USE AND AGREE TO BE BOUND BY THEM.
        </p>
      </div>

      <footer style={legalStyles.footer}>
        <Logo size={26} />
        <p style={{ color: "#475569", fontSize: 13, fontWeight: 400 }}>© 2026 LotDuel</p>
      </footer>
    </div>
  );
}
