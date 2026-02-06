'use client';
import React, { useState } from 'react';
import './HireFromUs.css';
import { FaWhatsapp, FaCheckCircle, FaUsers, FaStar } from 'react-icons/fa';

const HireFromUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        companyName: '',
        channelLink: '',
        fullAddress: '',
        editors: '',
        employmentType: '',
        skillLevel: '',
        roleNature: '',
        budget: '',
        additionalInfo: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = '919515595970';
        const message = encodeURIComponent('Hi, I would like to hire video editors from BBEdits.');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: 'cb7c23d0-d8e1-4080-bb7e-bcd9236dfcdd',
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    company: formData.companyName,
                    channel_link: formData.channelLink,
                    address: formData.fullAddress,
                    editors: formData.editors,
                    employment_type: formData.employmentType,
                    skill_level: formData.skillLevel,
                    role_nature: formData.roleNature,
                    budget: formData.budget,
                    additional_info: formData.additionalInfo || 'N/A',
                    subject: 'New Hire Request from BBEdits'
                })
            });

            const result = await response.json();

            if (result.success) {
                setSubmitMessage('✓ Form submitted successfully!');
                
                // Reset form after successful submission
                setTimeout(() => {
                    setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        companyName: '',
                        channelLink: '',
                        fullAddress: '',
                        editors: '',
                        employmentType: '',
                        skillLevel: '',
                        roleNature: '',
                        budget: '',
                        additionalInfo: ''
                    });
                    setSubmitMessage('');
                    setIsSubmitting(false);
                }, 2000);
            } else {
                setSubmitMessage('✗ Submission failed. Please try again.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitMessage('✗ An error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="hire-from-us">
            {/* Hero Section */}
            <section className="hire-hero-premium">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>
                
                <div className="hire-hero-container">
                    <div className="hero-badge">
                        <FaStar className="badge-icon" />
                        <span>Industry Leading Talent</span>
                    </div>
                    
                    <h1 className="hero-title-premium">
                        Hire Elite Video Editors
                        <span className="hero-title-gradient">Trained by Professionals</span>
                    </h1>
                    
                    <p className="hero-subtitle-premium">
                        Access our exclusive network of highly-skilled video editors specializing in 
                        Premiere Pro, After Effects, DaVinci Resolve, and advanced motion graphics.
                    </p>
                    
                    <div className="hero-features">
                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            <span>Pre-vetted Professionals</span>
                        </div>
                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            <span>Industry Certified</span>
                        </div>
                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                    
                    <div className="hero-cta-group">
                        <button onClick={handleWhatsAppClick} className="cta-whatsapp">
                            <FaWhatsapp className="cta-icon" />
                            <span>Connect on WhatsApp</span>
                        </button>
                        <a href="#hire-form" className="cta-form">
                            <span>View Hiring Form</span>
                            <svg className="cta-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                    </div>
                    
                    <div className="hero-stats-premium">
                        <div className="stat-card">
                            <div className="stat-number">300+</div>
                            <div className="stat-label">Placements</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Client Satisfaction</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Companies</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="hire-form-section-new" id="hire-form">
                <div className="form-container-new">
                    <div className="form-header">
                        <h2>Hiring Request Form</h2>
                        <p>Fill in the details below and we'll get back to you within 24 hours</p>
                    </div>
                    
                    <form className="hire-form-new" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 9515595970"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Company Name *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Your company name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Channel Link *</label>
                                <input
                                    type="url"
                                    name="channelLink"
                                    placeholder="https://youtube.com/..."
                                    value={formData.channelLink}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Number of Editors *</label>
                                <input
                                    type="text"
                                    name="editors"
                                    placeholder="e.g., 2-3 editors"
                                    value={formData.editors}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Employment Type *</label>
                                <select
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Skill Level *</label>
                                <select
                                    name="skillLevel"
                                    value={formData.skillLevel}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Role Nature *</label>
                                <select
                                    name="roleNature"
                                    value={formData.roleNature}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select role</option>
                                    <option value="video-editor">Video Editor</option>
                                    <option value="motion-graphics">Motion Graphics</option>
                                    <option value="color-grading">Color Grading</option>
                                    <option value="vfx">VFX Artist</option>
                                    <option value="animator">Animator</option>
                                    <option value="content-creator">Content Creator</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Budget Range *</label>
                                <input
                                    type="text"
                                    name="budget"
                                    placeholder="e.g., $500-$1000/month"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-full">
                            <label>Full Address *</label>
                            <input
                                type="text"
                                name="fullAddress"
                                placeholder="Your complete address"
                                value={formData.fullAddress}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group-full">
                            <label>Additional Information</label>
                            <textarea
                                name="additionalInfo"
                                placeholder="Any specific editing style or requirements you're looking for?"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>

                        <button type="submit" className="hire-submit-button-new" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Hiring Request'}
                        </button>

                        {submitMessage && <p className="submit-message-new">{submitMessage}</p>}
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HireFromUs;
