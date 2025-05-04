import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function TermsPage(props: { params: { domain: string } }) {
  const { domain } = props.params

  return (
    <div className='container mx-auto min-h-screen max-w-4xl px-3 pt-24 pb-12 md:pt-32 xl:px-0'>
      <Link href='/' className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Terms of Service</h1>
        <div className='prose dark:prose-invert mt-8 max-w-none'>
          <p>These Terms of Service govern your use of the website located at {domain} and any related services provided by us.</p>
          <h2>Limitations</h2>
          <p>You agree that we will not be liable to you or any third party for any loss or damages of any kind.</p>
          <h2>Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws applicable to agreements made and to be performed in the United States.</p>
        </div>
      </div>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: TermsPage, withCallToAction: false })

// # Drivly, Inc. Terms of Service
// **Last Updated: April 4, 2025 **
// If you signed a separate Cover Page to access the Product with the same account, and that agreement has not ended, the terms
// below do not apply to you. Instead, your separate Cover Page applies to your use of the Product.
// This Agreement is between Drivly, Inc. and the company or person accessing or using the Product. This Agreement consists of: (1)
// the Order Form below and (2) the Framework Terms defined below.
// <!-- Note: Check to confirm this paragraph works for your company and where your customers are located. -->If you are accessing
// or using the Product on behalf of your company, you represent that you are authorized to accept this Agreement on behalf of your
// company. By signing up, accessing, or using the Product, Customer indicates its acceptance of this Agreement and agrees to be
// bound by the terms and conditions of this Agreement.
// ## Cover Page
// *Order Form*
// **Framework Terms:** This Order Form incorporates and is governed by the Framework Terms that are made up of the Key Terms
// below and the Common Paper [Cloud Service Agreement Standard Terms Version 2.1](https://commonpaper.com/standards/cloud-
// service-agreement/2.1/), which are incorporated by reference. Any modifications to the Standard Terms made in the Cover Page will
// control over conflicts with the Standard Terms. Capitalized words have the meanings given in the Cover Page or the Standard
// Terms.
// code.
// **Order Date:** The Effective Date
// **Subscription Period:** 1 month(s)
// **Cloud Service:** Agentic Workflow Platform providing AI Functions and Infrastructure to represent your business processes as
// Certain parts of the Product have different pricing plans, which are available at Provider’s [pricing page](https://workflows.do).
// Customer will pay Provider the applicable Fees based on the Product tier and Customer’s usage. Provider may update Product
// pricing by giving at least 30 days notice to Customer (including by email or notification within the Product), and the change will apply
// in the next Subscription Period.
// **Payment Process:**
// Automatic payment:
// without further approval.
// Customer authorizes Provider to bill and charge Customer's payment method on file Monthly for immediate payment or deduction
// **Non-Renewal Notice Period:** At least 30 days before the end of the current Subscription Period.
// *Key Terms*
// **Customer:** The company or person who accesses or uses the Product. If the person accepting this Agreement is doing so on
// behalf of a company, all use of the word "Customer" in the Agreement will mean that company.
// **Provider:** Drivly, Inc.
// **Effective Date:** The date Customer first accepts this Agreement.
// **Governing Law:** The laws of the State of Delaware
// **Chosen Courts:** The state or federal courts located in Delaware
// **Covered Claims:**
// **Provider Covered Claims:** Any action, proceeding, or claim that the Cloud Service, when used by Customer according to the
// terms of the Agreement, violates, misappropriates, or otherwise infringes upon anyone else’s intellectual property or other
// proprietary rights.
// **Customer Covered Claims:** Any action, proceeding, or claim that (1) the Customer Content, when used according to the terms
// of the Agreement, violates, misappropriates, or otherwise infringes upon anyone else’s intellectual property or other proprietary
// rights; or (2) results from Customer’s breach or alleged breach of Section 2.1 (Restrictions on Customer).
// **General Cap Amount:**
// The fees paid or payable by Customer to provider in the 12 month period immediately before the claim
// **Notice Address:**
// For Provider: notices@driv.ly
// For Customer: The main email address on Customer's account
