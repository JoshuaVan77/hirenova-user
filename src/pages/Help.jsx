import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the customer review robot?",
      answer: "The customer review robot is a marketing and promotion company dedicated to helping customers order merchants around the world to increase order sales and increase browsing data for customer review sites. We are committed to a fair and transparent model between customers, merchants and consumers. Combined with the latest P2P blockchain technology, customers and merchants are equally connected through USDT (TRC-20). Payment of order income from customers, while merchants increase store sales data. The latest proof model is the internet blockchain model."
    },
    {
      question: "How does the customer review robot work?",
      answer: "Through daily feedback from our team, it is found that customer sales need to be improved. Users need to click on the order easily, and the system will automatically generate an order submission. Users pay the order amount via USDT (TRC-20) or bank transfer every day."
    },
    {
      question: "Why are there differences in the price of each transaction?",
      answer: "The types of trading items and the trading methods provided by exchanges, therefore, the same currency may also have price differences in different transactions. The price of the goods you get, the higher the order, the more the system benefits. The system will randomly assign large commission orders."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Help & FAQ</h1>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-secondary" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dark-card rounded-xl border border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-white">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trading Rules */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Trading Rules</h2>
          <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-sm text-gray-400 leading-relaxed">
            <p className="mb-2">The system automatically generates and distributes 40 product orders to users every day. Users can get 0.25% commission after they complete. Large commission orders are randomly assigned.</p>
            <p>USDT can be withdrawn after 40 orders are completed, the system will automatically calculate the number of orders remaining to that day.</p>
          </div>
        </div>

        {/* How to Withdraw/Top Up */}
        <div className="space-y-4">
          <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
            <h3 className="text-white font-semibold mb-2">How to withdraw?</h3>
            <p className="text-gray-400 text-sm">After completing the daily order delivery, you can withdraw normally, and it will arrive within 24 hours after initiating the withdrawal, and there is no withdrawal limit.</p>
          </div>
          <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
            <h3 className="text-white font-semibold mb-2">How to top up?</h3>
            <p className="text-gray-400 text-sm">Before recharging, please find your withdrawal address (support TRC-20 USDT address), you can go to the APP or webpage to click to recharge, select the blockchain (TRC-20) you want to recharge.</p>
          </div>
        </div>

      </div>
    </div>
  );
}