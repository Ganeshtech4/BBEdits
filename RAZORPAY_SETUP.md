# Razorpay Integration Guide

## ✅ Migration Complete!

Your Learning Management System has been successfully migrated from Stripe to Razorpay payment gateway.

## 🔑 Setup Razorpay Credentials

### Step 1: Create Razorpay Account
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Sign up for a Razorpay account
3. Complete the KYC verification process

### Step 2: Get API Keys
1. Log in to your Razorpay Dashboard
2. Navigate to **Settings** → **API Keys**
3. Generate your Test/Live API Keys
4. You'll get:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

### Step 3: Update Environment Variables

Open your `.env` file and update the following:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**⚠️ Important:**
- For testing, use keys starting with `rzp_test_`
- For production, use keys starting with `rzp_live_`
- Never commit your `.env` file to version control
- Keep your Key Secret secure

## 📋 What Has Changed

### Backend Changes
1. **Dependencies:**
   - ✅ Added: `razorpay` package
   - ❌ Removed: `stripe` package

2. **Controllers** (`controllers/order.controller.ts`):
   - Replaced Stripe initialization with Razorpay
   - Updated `createOrder` to verify Razorpay payment signatures
   - Changed `sendStripePublishableKey` → `sendRazorpayKey`
   - Changed `newPayment` → `createRazorpayOrder`

3. **Routes** (`routes/order.route.ts`):
   - Updated endpoint: `/payment/razorpaykey` (was `/payment/stripepublishablekey`)
   - Updated endpoint: `/payment/create-order` (was `/payment`)

### Frontend Changes
1. **Dependencies:**
   - ❌ Removed: `@stripe/react-stripe-js`, `@stripe/stripe-js`

2. **Redux API** (`client/redux/features/orders/ordersApi.ts`):
   - Changed `getStripePublishablekey` → `getRazorpayKey`
   - Changed `createPaymentIntent` → `createRazorpayOrder`
   - Updated hooks: `useGetRazorpayKeyQuery`, `useCreateRazorpayOrderMutation`

3. **Components:**
   - Created: `client/app/components/Payment/RazorpayCheckout.tsx`
   - Updated: `client/app/components/Course/CourseDetails.tsx`
   - Updated: `client/app/components/Course/CourseDetailsPage.tsx`

## 🎯 How Razorpay Payment Works

### Payment Flow:
1. User clicks "Buy Now" on a course
2. Frontend creates a Razorpay order via backend API
3. Razorpay checkout modal opens with payment options
4. User completes payment (UPI, Cards, Net Banking, Wallets)
5. Razorpay verifies payment and returns payment details
6. Backend verifies the payment signature for security
7. Order is created and course is added to user's account
8. User receives email confirmation

### Security:
- All payments are verified using HMAC SHA256 signature
- Razorpay handles sensitive card data (PCI DSS compliant)
- Your server never touches raw payment credentials

## 💳 Payment Methods Supported

Razorpay supports:
- 💳 Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
- 📱 UPI (Google Pay, PhonePe, Paytm, BHIM)
- 🏦 Net Banking (All major Indian banks)
- 💰 Wallets (Paytm, Mobikwik, Freecharge, etc.)
- 💵 EMI Options
- 🌐 International Cards

## 🧪 Testing Payments

### Test Mode:
Use these test credentials in Razorpay test mode:

**Test Cards:**
- **Success:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

**Test UPI:**
- **UPI ID:** `success@razorpay`

**Test Net Banking:**
- Select any bank and use test credentials from Razorpay docs

### Razorpay Test Dashboard:
- View all test transactions at: https://dashboard.razorpay.com/app/dashboard
- Test payments won't deduct real money

## 🚀 Go Live Checklist

Before going live with real payments:

- [ ] Complete Razorpay KYC verification
- [ ] Activate your Razorpay account
- [ ] Generate Live API Keys (starting with `rzp_live_`)
- [ ] Update `.env` with Live Keys
- [ ] Test payment flow end-to-end
- [ ] Set up webhook for payment notifications (optional)
- [ ] Review Razorpay fee structure and pricing
- [ ] Enable required payment methods in Razorpay dashboard
- [ ] Set up settlement account in Razorpay dashboard

## 📊 Currency Information

- **Default Currency:** INR (Indian Rupees ₹)
- All prices in your application are now displayed in ₹
- Razorpay automatically handles currency conversion for international cards

## 🔧 Troubleshooting

### Issue: "Razorpay is not defined"
**Solution:** The Razorpay script loads dynamically. Ensure you're testing on a proper server (localhost or deployed).

### Issue: Payment signature verification failed
**Solution:** 
- Check that `RAZORPAY_KEY_SECRET` in `.env` matches your dashboard
- Ensure the secret hasn't been changed or rotated

### Issue: Payment succeeds but order not created
**Solution:**
- Check browser console for errors
- Verify backend logs for error messages
- Ensure user is logged in

### Issue: Checkout modal not opening
**Solution:**
- Check browser console for JavaScript errors
- Ensure Razorpay script loaded successfully
- Verify `RAZORPAY_KEY_ID` is correct

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Payment Gateway Integration Guide](https://razorpay.com/docs/payments/payment-gateway/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)

## 💡 Pro Tips

1. **Webhooks:** Set up Razorpay webhooks to get real-time payment notifications
2. **Refunds:** Use Razorpay dashboard or API to process refunds
3. **Analytics:** Monitor payment success rates in Razorpay dashboard
4. **Customization:** Customize checkout modal colors in Razorpay settings
5. **Settlement:** Configure auto-settlement schedule (T+0, T+1, T+7, etc.)

## 🎉 Benefits of Razorpay

✅ **India-focused:** Optimized for Indian payment methods  
✅ **Multiple options:** UPI, Cards, Net Banking, Wallets  
✅ **Better success rates:** Higher payment success rates in India  
✅ **Lower fees:** Competitive pricing for Indian merchants  
✅ **Instant settlements:** T+0 settlement available  
✅ **Local support:** Indian customer support  
✅ **INR native:** No currency conversion complications  

## 📞 Support

If you face any issues:
- **Razorpay Support:** https://razorpay.com/support/
- **Email:** support@razorpay.com
- **Phone:** +91-80-6172-7727

---

**Migration completed successfully! 🎊**

Your application is now ready to accept payments through Razorpay. Update your environment variables with real API keys and start accepting payments!
