'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaymentPage() {
  // Check if we're in a post-redirect situation by looking at the URL
  const isPostRedirect = typeof window !== 'undefined' && window.location.href.includes('PostTransaction');

  const [formData, setFormData] = useState({
    MERCHANT_ID: '26623',
    SECURED_KEY: '_kqbD5giY0EgPsq_R4JUgg',
    BASKET_ID: 'ITEM-OOFX',
    TXNAMT: '5',
    CURRENCY_CODE: 'PKR',
    MERCHANT_NAME: 'Payfast Merchant',
    TOKEN: '',
    ORDER_DATE: '2025-04-24 10:00:00',
    SUCCESS_URL: 'http://localhost:3000/payment/success',
    FAILURE_URL: 'http://localhost:3000/payment/failure',
    CHECKOUT_URL: 'http://localhost:3000/payment/checkout',
    CUSTOMER_EMAIL_ADDRESS: 'someone234@gmai.com',
    CUSTOMER_MOBILE_NO: '03000000090',
    SIGNATURE: 'SOMERANDOM-STRING',
    VERSION: 'MERCHANTCART-0.1',
    TXNDESC: 'Item Purchased from Cart',
    PROCCODE: '00',
    TRAN_TYPE: 'ECOMM_PURCHASE',
    STORE_ID: '',
    RECURRING_TXN: '',
  });

  const [debugInfo, setDebugInfo] = useState({
    tokenResponse: null,
    error: null,
  });

  // Add a ref to track if token request has been made
  const tokenRequestMade = useRef(false);

  // Generate random string for basket ID
  const generateRandomString = (length = 4) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Get access token
  const getAccessToken = async () => {
    try {
      // Log the request data
      console.log('Requesting token with:', {
        MERCHANT_ID: formData.MERCHANT_ID,
        SECURED_KEY: formData.SECURED_KEY,
        BASKET_ID: formData.BASKET_ID,
        TXNAMT: formData.TXNAMT,
        CURRENCY_CODE: formData.CURRENCY_CODE
      });

      const response = await fetch('/api/payment/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MERCHANT_ID: formData.MERCHANT_ID,
          SECURED_KEY: formData.SECURED_KEY,
          BASKET_ID: formData.BASKET_ID,
          TXNAMT: formData.TXNAMT,
          CURRENCY_CODE: formData.CURRENCY_CODE
        }),
      });

      const data = await response.json();
      console.log('Token response:', data);
      
      // Store debug info
      setDebugInfo(prev => ({
        ...prev,
        tokenResponse: data
      }));

      return data.accessToken || '';
    } catch (error: any) {
      console.error('Error getting access token:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message
      }));
      return '';
    }
  };

  // Generate current date in the exact format expected by PayFast
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    // Skip token request if we're in a redirect situation
    if (isPostRedirect) {
      console.log('Redirect in progress, skipping token request');
      return;
    }

    // Skip if the token request has already been made
    if (tokenRequestMade.current) {
      console.log('Token request already made, skipping duplicate request');
      return;
    }

    // Generate basketId and set current date on component mount
    const newBasketId = 'ITEM-' + generateRandomString(4);
    const currentDate = getCurrentDate();

    setFormData((prev) => ({
      ...prev,
      BASKET_ID: newBasketId,
      ORDER_DATE: currentDate,
    }));

    // Get token when basketId is updated
    const fetchToken = async () => {
      if (newBasketId) {
        // Mark that token request has been made
        tokenRequestMade.current = true;
        const token = await getAccessToken();
        console.log('Retrieved token:', token);
        setFormData((prev) => ({ ...prev, TOKEN: token }));
      }
    };

    fetchToken();
  }, [isPostRedirect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Direct mapping from form field names to state object
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show loading indicator or disable the submit button here if needed
      console.log('Form submission started, refreshing token...');
      
      // Before form submission, refresh the token one more time
      const token = await getAccessToken();
      
      if (!token) {
        alert('Unable to get authorization token. Please try again.');
        return;
      }
      
      console.log('New token received, updating form and submitting...');
      
      // Update the form with the new token
      const form = e.target as HTMLFormElement;
      const tokenInput = form.elements.namedItem('TOKEN') as HTMLInputElement;
      if (tokenInput) {
        tokenInput.value = token;
        
        // Disable the useEffect token refresh during redirect
        tokenRequestMade.current = true;
        
        // Also update the state
        setFormData(prev => ({ ...prev, TOKEN: token }));
        
        // Now submit the form
        console.log('Submitting form with token:', token);
        form.submit();
      } else {
        alert('Form error: TOKEN field not found');
      }
    } catch (error: any) {
      console.error('Error during form submission:', error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">
        PayFast Example Code For Redirection Payment Request
      </h2>

      {debugInfo.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{debugInfo.error}</p>
        </div>
      )}
      
      {debugInfo.tokenResponse && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Token Response:</p>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo.tokenResponse, null, 2)}
          </pre>
        </div>
      )}

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="PayFast_payment_form"
            name="PayFast-payment-form"
            method="post"
            action="https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
            className="space-y-4"
            onSubmit={isPostRedirect ? undefined : handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="CURRENCY_CODE">CURRENCY_CODE</Label>
                <Input
                  type="text"
                  id="CURRENCY_CODE"
                  name="CURRENCY_CODE"
                  value={formData.CURRENCY_CODE}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MERCHANT_ID">MERCHANT_ID</Label>
                <Input
                  type="text"
                  id="MERCHANT_ID"
                  name="MERCHANT_ID"
                  value={formData.MERCHANT_ID}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MERCHANT_NAME">MERCHANT_NAME</Label>
                <Input
                  type="text"
                  id="MERCHANT_NAME"
                  name="MERCHANT_NAME"
                  value={formData.MERCHANT_NAME}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TOKEN">TOKEN</Label>
                <Input
                  type="text"
                  id="TOKEN"
                  name="TOKEN"
                  value={formData.TOKEN}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="BASKET_ID">BASKET_ID</Label>
                <Input
                  type="text"
                  id="BASKET_ID"
                  name="BASKET_ID"
                  value={formData.BASKET_ID}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TXNAMT">TXNAMT</Label>
                <Input
                  type="text"
                  id="TXNAMT"
                  name="TXNAMT"
                  value={formData.TXNAMT}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ORDER_DATE">ORDER_DATE</Label>
                <Input
                  type="text"
                  id="ORDER_DATE"
                  name="ORDER_DATE"
                  value={formData.ORDER_DATE}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="SUCCESS_URL">SUCCESS_URL</Label>
                <Input
                  type="text"
                  id="SUCCESS_URL"
                  name="SUCCESS_URL"
                  value={formData.SUCCESS_URL}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="FAILURE_URL">FAILURE_URL</Label>
                <Input
                  type="text"
                  id="FAILURE_URL"
                  name="FAILURE_URL"
                  value={formData.FAILURE_URL}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CHECKOUT_URL">CHECKOUT_URL</Label>
                <Input
                  type="text"
                  id="CHECKOUT_URL"
                  name="CHECKOUT_URL"
                  value={formData.CHECKOUT_URL}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CUSTOMER_EMAIL_ADDRESS">CUSTOMER_EMAIL_ADDRESS</Label>
                <Input
                  type="text"
                  id="CUSTOMER_EMAIL_ADDRESS"
                  name="CUSTOMER_EMAIL_ADDRESS"
                  value={formData.CUSTOMER_EMAIL_ADDRESS}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CUSTOMER_MOBILE_NO">CUSTOMER_MOBILE_NO</Label>
                <Input
                  type="text"
                  id="CUSTOMER_MOBILE_NO"
                  name="CUSTOMER_MOBILE_NO"
                  value={formData.CUSTOMER_MOBILE_NO}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="SIGNATURE">SIGNATURE</Label>
                <Input
                  type="text"
                  id="SIGNATURE"
                  name="SIGNATURE"
                  value={formData.SIGNATURE}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="VERSION">VERSION</Label>
                <Input
                  type="text"
                  id="VERSION"
                  name="VERSION"
                  value={formData.VERSION}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TXNDESC">Item Description</Label>
                <Input
                  type="text"
                  id="TXNDESC"
                  name="TXNDESC"
                  value={formData.TXNDESC}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="PROCCODE">Proccode</Label>
                <Input
                  type="text"
                  id="PROCCODE"
                  name="PROCCODE"
                  value={formData.PROCCODE}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TRAN_TYPE">Transaction Type</Label>
                <Input
                  type="text"
                  id="TRAN_TYPE"
                  name="TRAN_TYPE"
                  value={formData.TRAN_TYPE}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="STORE_ID">Store ID/Terminal ID (optional)</Label>
                <Input
                  type="text"
                  id="STORE_ID"
                  name="STORE_ID"
                  value={formData.STORE_ID}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="RECURRING_TXN">Create Recurring Token</Label>
                <Select value={formData.RECURRING_TXN} onValueChange={(value) => handleSelectChange('RECURRING_TXN', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Do NOT Create Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">Do NOT Create Token</SelectItem>
                    <SelectItem value="TRUE">YES, Create Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hidden Values */}
            <input type="hidden" name="MERCHANT_USERAGENT" value="Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0" />
            <input type="hidden" name="ITEMS[0][SKU]" value="SAMPLE-SKU-01" />
            <input type="hidden" name="ITEMS[0][NAME]" value="An Awesome Dress" />
            <input type="hidden" name="ITEMS[0][PRICE]" value="150" />
            <input type="hidden" name="ITEMS[0][QTY]" value="2" />
            <input type="hidden" name="ITEMS[1][SKU]" value="SAMPLE-SKU-02" />
            <input type="hidden" name="ITEMS[1][NAME]" value="Ice Cream" />
            <input type="hidden" name="ITEMS[1][PRICE]" value="45" />
            <input type="hidden" name="ITEMS[1][QTY]" value="5" />

            <div className="flex justify-center mt-6">
              <Button type="submit" className="w-full md:w-auto">Submit Payment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 