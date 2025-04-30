'use client';

import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About BidMe</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Welcome to BidMe, your premier platform for online auctions and bidding.
        </p>
        <p className="mb-4">
          Our mission is to provide a seamless and secure environment for buyers and sellers to connect
          through the power of competitive bidding.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Features</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Real-time bidding system</li>
          <li>Secure payment processing</li>
          <li>User-friendly interface</li>
          <li>Comprehensive item listings</li>
          <li>Bid history tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage; 