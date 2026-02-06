'use client';
import React from 'react';
import './OurClients.css';

const OurClients = () => {
    const clients = [
        { name: "Tech Giants", role: "Technology" },
        { name: "Creative Studios", role: "Media & Entertainment" },
        { name: "Marketing Agencies", role: "Advertising" },
        { name: "E-commerce Brands", role: "Retail" },
        { name: "Educational Platforms", role: "Education" },
        { name: "Healthcare Companies", role: "Healthcare" },
    ];

    return (
        <section className="our-clients-section">
            <div className="our-clients-container">
                <h2 className="our-clients-title">Look Who's Hiring From Us</h2>
                <p className="our-clients-subtitle">
                    Our talented video editors are trusted by leading companies across various industries
                </p>
                
                <div className="clients-grid">
                    {clients.map((client, index) => (
                        <div key={index} className="client-card">
                            <div className="client-icon">
                                <svg 
                                    width="48" 
                                    height="48" 
                                    viewBox="0 0 48 48" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect 
                                        x="4" 
                                        y="4" 
                                        width="40" 
                                        height="40" 
                                        rx="8" 
                                        stroke="url(#gradient)" 
                                        strokeWidth="2"
                                    />
                                    <path 
                                        d="M18 24L22 28L30 20" 
                                        stroke="url(#gradient)" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="4" y1="4" x2="44" y2="44">
                                            <stop offset="0%" stopColor="#8543C7" />
                                            <stop offset="100%" stopColor="#37a39a" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3 className="client-name">{client.name}</h3>
                            <p className="client-role">{client.role}</p>
                        </div>
                    ))}
                </div>

                <div className="clients-stats">
                    <div className="stat-card">
                        <h3 className="stat-number">300+</h3>
                        <p className="stat-label">Successful Placements</p>
                    </div>
                    <div className="stat-card">
                        <h3 className="stat-number">95%</h3>
                        <p className="stat-label">Client Satisfaction</p>
                    </div>
                    <div className="stat-card">
                        <h3 className="stat-number">50+</h3>
                        <p className="stat-label">Partner Companies</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurClients;
