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
  ul: {
    paddingLeft: 24, marginBottom: 16, color: "#94a3b8"
  },
  li: {
    marginBottom: 8
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

export default function PrivacyPolicy({ onBack }) {
  return (
    <div style={legalStyles.wrapper}>
      <div style={legalStyles.header}>
        <Logo size={26} />
        <button style={legalStyles.backBtn} onClick={onBack}>← Back</button>
      </div>

      <div style={legalStyles.content}>
        <h1 style={legalStyles.h1}>Privacy Policy</h1>
        <p style={{ ...legalStyles.p, color: "#64748b", fontSize: 13, marginBottom: 32 }}>
          <strong style={legalStyles.strong}>WiseCorp LLC</strong> — Last Updated: April 14, 2026
        </p>

        <p style={legalStyles.p}>
          WiseCorp LLC ("LotDuel," "Company," "We," "Our") respects your privacy and is committed to protecting it through our compliance with this Privacy Policy ("Privacy Policy" or "Policy"). This document details the types of information we may collect or that you may provide when you access, use, or register with LotDuel's website and from the provision of LotDuel's services (collectively "Services") and our practices for using, maintaining, protecting, and disclosing that information.
        </p>

        <p style={legalStyles.p}>
          Please read this carefully to understand our policies and practices regarding your information and how we will treat it. By using or registering with our Services, you agree to this Privacy Policy. If you do not agree to the terms of this Policy, you are not permitted to use LotDuel's Services. Your continued use of our Services after we make changes is deemed to be acceptance of those changes, so please check the Privacy Policy periodically for updates as it may change from time to time.
        </p>

        <h2 style={legalStyles.h2}>Applicability of This Privacy Policy</h2>
        <p style={legalStyles.p}>
          This Privacy Policy applies to the Services. If you do not agree with this Privacy Policy, then do not access or use the LotDuel website or any other aspect of the Company's business.
        </p>
        <p style={legalStyles.p}>
          This Privacy Policy does not apply to any third-party applications or software that integrate with the Services through the LotDuel platform ("Third-Party Services"), or any other third-party products, services, or businesses who will provide their services under their own terms of service and privacy policy.
        </p>

        <h2 style={legalStyles.h2}>Information We Collect and How We Collect It</h2>
        <p style={legalStyles.p}>We collect information from and about users of our Services:</p>
        <ul style={legalStyles.ul}>
          <li style={legalStyles.li}>Directly from you when you provide it to us.</li>
          <li style={legalStyles.li}>Automatically when you use the Services.</li>
        </ul>

        <h2 style={legalStyles.h2}>Information You Provide to Us</h2>
        <p style={legalStyles.p}>
          When you use or register with the Services, we may ask you to provide information by which you may be personally identified, such as your email address, name, location, and any other identifier by which you may be contacted or identified online or offline ("Personal Information"). This information includes:
        </p>
        <ul style={legalStyles.ul}>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Account Information.</strong> When you register for the LotDuel Services, you supply the Company with your name, email address, and/or other account setup details.</li>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Vehicle Request Information.</strong> Information you provide related to the Services, including but not limited to vehicle make, model, year, trim, mileage preferences, zip code, and search radius.</li>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Dealer Submission Information.</strong> If you are a dealer submitting a quote, this includes vehicle details, out-the-door pricing, certification status, stock numbers, and contact information.</li>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Transactions.</strong> Details of transactions you carry out through the Services, if applicable, including financial information if you purchase a paid version of the Services.</li>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Communications.</strong> Records and copies of your correspondence (including email addresses and phone numbers), if you contact us. We may also ask you for information when you report a problem with the Services.</li>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Surveys.</strong> Your responses to surveys that we might ask you to complete for research and development purposes.</li>
        </ul>

        <h2 style={legalStyles.h2}>Automatic Information Collection</h2>
        <p style={legalStyles.p}>When you access or use the Services, we may use technology to automatically collect:</p>
        <ul style={legalStyles.ul}>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Usage Details:</strong> When you access and use the Services, we may automatically collect certain details of your access to and use of the Services, including traffic data, location data, logs, and other communication data and the resources that you access and use on or through the Services.</li>
          <li style={legalStyles.li}><strong style={legalStyles.strong}>Device Information:</strong> We may collect information about your computer or mobile device and internet connection, including the device's unique identifier, IP address, operating system, and browser type.</li>
        </ul>

        <h2 style={legalStyles.h2}>Cookies, Local Storage, and Tracking</h2>
        <p style={legalStyles.p}>
          Our Services use local storage and cookies, which are small text files that are intended to make the Services better for you to use. In general, cookies are used to retain preferences, store information for things like language preferences, and provide tracking data to third-party applications like Google Analytics. You may, however, disable cookies on the Services. The most effective way to do this is to disable cookies in your browser.
        </p>
        <p style={legalStyles.p}>
          We use local storage to store session tokens that are necessary for the operation of our website. These tokens help maintain your login session and ensure secure access to your account. Unlike cookies, these session tokens cannot be disabled or opted out of, as they are essential for the website to function properly.
        </p>
        <p style={legalStyles.p}>
          The Services also use third-party analysis and tracking services to track the performance of our services, understand how you use our services, and offer you an improved and safer experience. Such usage information is retained only as long as is necessary for our business purposes and will not be shared with third parties until after being anonymized.
        </p>

        <h2 style={legalStyles.h2}>Use of Personal Information We Collect</h2>
        <p style={legalStyles.p}>We may use the information we collect from you in the following ways:</p>
        <ul style={legalStyles.ul}>
          <li style={legalStyles.li}>To set up and verify your account with us.</li>
          <li style={legalStyles.li}>To perform transactions through the Services and third-party service providers such as Stripe, which may be used to process transactions and online payments.</li>
          <li style={legalStyles.li}>To personalize your user experience and to allow us to deliver the type of content and offerings in which you are most interested.</li>
          <li style={legalStyles.li}>To deliver service messages and other services and content you request, including confirmations, invoices, technical notices, updates, security alerts, and support and administrative messages.</li>
          <li style={legalStyles.li}>To conduct an aggregated analysis of the performance of our Services, including referral data if you arrive at our website from an external source.</li>
        </ul>
        <p style={legalStyles.p}>
          All the data we collect at LotDuel is necessary for us to deliver the services you use. The amount we collect has been minimized wherever possible to respect your privacy.
        </p>

        <h2 style={legalStyles.h2}>How We May Share Information We Collect</h2>
        <p style={legalStyles.p}>We may share personal information as follows:</p>
        <ul style={legalStyles.ul}>
          <li style={legalStyles.li}>We may share personal information with your consent.</li>
          <li style={legalStyles.li}>To provide to third-party service providers that perform services on our behalf, such as third-party payment platforms.</li>
          <li style={legalStyles.li}>We may share personal information when we do a business deal, or negotiate a business deal, involving the sale or transfer of all or a part of our business or assets. However, this information will be in the aggregate and anonymized to protect your personal information.</li>
          <li style={legalStyles.li}>We may share information to respond to lawful requests and legal processes.</li>
          <li style={legalStyles.li}>We may share information to protect the rights and property of LotDuel, our agents, customers, and others.</li>
          <li style={legalStyles.li}>We may share information in an emergency, including protecting the safety of our employees, agents, customers, or any person.</li>
        </ul>
        <p style={legalStyles.p}>
          <strong style={legalStyles.strong}>We will not sell your personal information or user data to third parties for any reason without your consent.</strong>
        </p>

        <h2 style={legalStyles.h2}>Data Retention</h2>
        <p style={legalStyles.p}>
          We retain personal information we collect from you where we have an ongoing legitimate business need to do so (for example, to provide you with a service you have requested or to comply with applicable legal, tax, or accounting requirements). When we have no ongoing legitimate business need to process personal information, we will either delete or anonymize it or, if this is not possible, then we will securely store personal information and isolate it from any further processing until deletion is possible.
        </p>

        <h2 style={legalStyles.h2}>Security of Your Personal Information</h2>
        <p style={legalStyles.p}>
          LotDuel takes reasonable security measures to protect your Personal Information to prevent loss, misuse, unauthorized access, disclosure, alteration, and destruction. Please be aware, however, that despite our efforts, no security measures are impenetrable. If you use a password on the Services, you are responsible for keeping it confidential. Do not share it with any other person. If you believe your password has been misused, please notify us immediately.
        </p>

        <h2 style={legalStyles.h2}>Your Data Protection Rights Under the GDPR</h2>
        <p style={legalStyles.p}>
          If you are a resident of the EEA, you have the following data protection rights: You may access, correct, update, or request deletion of your personal information. In addition, you can object to the processing of your personal information, ask us to restrict the processing of your personal information, or request portability of your personal information. You have the right to opt-out of marketing communications we send you at any time. Similarly, if we have collected and process your personal information with your consent, then you can withdraw your consent at any time. To exercise any of these rights, please contact us at support@lotduel.com.
        </p>

        <h2 style={legalStyles.h2}>Your Data Protection Rights Under the CCPA</h2>
        <p style={legalStyles.p}>
          The California Consumer Privacy Act ("CCPA") provides consumers with specific rights regarding their Personal Information. If you are a California resident, you have the right to:
        </p>
        <ul style={legalStyles.ul}>
          <li style={legalStyles.li}>Request we disclose to you the categories of Personal Information about you that we collected, the sources, the purposes, and the categories of third parties to whom we disclosed it.</li>
          <li style={legalStyles.li}>Request we correct inaccurate personal information we maintain about you.</li>
          <li style={legalStyles.li}>Request we delete Personal Information we collected from you, unless the CCPA recognizes an exception.</li>
          <li style={legalStyles.li}>If the business sells or shares Personal Information, you have a right to opt-out.</li>
        </ul>
        <p style={legalStyles.p}>
          We do not sell your personal information for money or anything of value, and we do not share your personal information with third parties for cross-context behavioral advertising. If you are a California resident and wish to exercise your rights under the CCPA, please contact us at support@lotduel.com.
        </p>

        <h2 style={legalStyles.h2}>Washington Privacy Rights</h2>
        <p style={legalStyles.p}>
          We do not collect or process consumer health data as defined under the Washington My Health My Data Act. If this changes in the future, we will update this Privacy Policy accordingly.
        </p>

        <h2 style={legalStyles.h2}>Updating and Accessing Your Personal Information</h2>
        <p style={legalStyles.p}>
          If your Personal Information changes, we invite you to correct or update your information. We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account, request that we no longer use your information to provide you services, or delete your Personal Information, you may do so through your account settings or contact us at support@lotduel.com. We will respond to your request as soon as possible.
        </p>

        <h2 style={legalStyles.h2}>Third-Party Disclosure and Links</h2>
        <p style={legalStyles.p}>
          The Services may include links or integrations that lead to other websites and software platforms whose privacy practices may differ from those of LotDuel. If you use any of these third-party sites, your information is governed by their privacy statements. We encourage you to carefully read the privacy statement of any third-party websites or software you use.
        </p>

        <h2 style={legalStyles.h2}>Notice Concerning the Information of Children</h2>
        <p style={legalStyles.p}>
          LotDuel is not directed to children under the age of 13 and does not intentionally collect any information from children under the age of 13. Please contact us if your child has provided Personal Information to us and we will delete the information.
        </p>

        <h2 style={legalStyles.h2}>Changes to This Policy</h2>
        <p style={legalStyles.p}>
          LotDuel may change this Policy from time to time. If we make any changes to this Policy, we will change the "Last Updated" date above and may notify you by email. We encourage you to review this Policy whenever you visit the Services to understand how your Personal Information is used.
        </p>

        <h2 style={legalStyles.h2}>Questions About This Policy</h2>
        <p style={legalStyles.p}>
          If you have any questions about this Policy, our practices related to the Services, or if you would like to have us remove your information from our database, please feel free to contact us at{" "}
          <a href="mailto:support@lotduel.com" style={legalStyles.link}>support@lotduel.com</a>.
        </p>
      </div>

      <footer style={legalStyles.footer}>
        <Logo size={26} />
        <p style={{ color: "#475569", fontSize: 13, fontWeight: 400 }}>© 2026 LotDuel</p>
      </footer>
    </div>
  );
}
