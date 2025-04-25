'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    merchantId: '26623',
    securedKey: '_kqbD5giY0EgPsq_R4JUgg',
    basketId: 'ITEM-OOFX',
    transAmount: '5',
    currencyCode: 'PKR',
    merchantName: 'Payfast Merchant',
    token: '',
    orderDate: '2025-04-24 10:00:00',
    successUrl: 'http://localhost:3000/payment/success',
    failureUrl: 'http://localhost:3000/payment/failure',
    checkoutUrl: 'http://localhost:3000/payment/checkout',
    customerEmail: 'someone234@gmai.com',
    customerMobile: '03000000090',
    signature: 'SOMERANDOM-STRING',
    version: 'MERCHANTCART-0.1',
    itemDescription: 'Item Purchased from Cart',
    proccode: '00',
    tranType: 'ECOMM_PURCHASE',
    storeId: '',
    recurringTxn: '',
  });

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
      const response = await fetch('/api/payment/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: formData.merchantId,
          securedKey: formData.securedKey,
          basketId: formData.basketId,
          transAmount: formData.transAmount,
          currencyCode: formData.currencyCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.accessToken || '';
    } catch (error) {
      console.error('Error getting access token:', error);
      return '';
    }
  };

  useEffect(() => {
    // Generate basketId and set current date on component mount
    const newBasketId = 'ITEM-' + generateRandomString(4);
    const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setFormData((prev) => ({
      ...prev,
      basketId: newBasketId,
      orderDate: currentDate,
    }));

    // Get token when basketId is updated
    const fetchToken = async () => {
      if (newBasketId) {
        const token = await getAccessToken();
        setFormData((prev) => ({ ...prev, token }));
      }
    };

    fetchToken();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Map form field names to state object keys
    const fieldMap: {[key: string]: string} = {
      'CURRENCY_CODE': 'currencyCode',
      'MERCHANT_ID': 'merchantId',
      'MERCHANT_NAME': 'merchantName',
      'TOKEN': 'token',
      'BASKET_ID': 'basketId',
      'TXNAMT': 'transAmount',
      'ORDER_DATE': 'orderDate',
      'SUCCESS_URL': 'successUrl',
      'FAILURE_URL': 'failureUrl',
      'CHECKOUT_URL': 'checkoutUrl',
      'CUSTOMER_EMAIL_ADDRESS': 'customerEmail',
      'CUSTOMER_MOBILE_NO': 'customerMobile',
      'SIGNATURE': 'signature',
      'VERSION': 'version',
      'TXNDESC': 'itemDescription',
      'PROCCODE': 'proccode',
      'TRAN_TYPE': 'tranType',
      'STORE_ID': 'storeId',
      'RECURRING_TXN': '',
    };
    
    const stateKey = fieldMap[name] || name;
    setFormData((prev) => ({ ...prev, [stateKey]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">
        PayFast Example Code For Redirection Payment Request
      </h2>

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
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="CURRENCY_CODE">CURRENCY_CODE</Label>
                <Input
                  type="text"
                  id="CURRENCY_CODE"
                  name="CURRENCY_CODE"
                  value={formData.currencyCode}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MERCHANT_ID">Merchant_ID</Label>
                <Input
                  type="text"
                  id="MERCHANT_ID"
                  name="MERCHANT_ID"
                  value={formData.merchantId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MERCHANT_NAME">MERCHANT_NAME</Label>
                <Input
                  type="text"
                  id="MERCHANT_NAME"
                  name="MERCHANT_NAME"
                  value={formData.merchantName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TOKEN">TOKEN</Label>
                <Input
                  type="text"
                  id="TOKEN"
                  name="TOKEN"
                  value={formData.token}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="BASKET_ID">BASKET_ID</Label>
                <Input
                  type="text"
                  id="BASKET_ID"
                  name="BASKET_ID"
                  value={formData.basketId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TXNAMT">TXNAMT</Label>
                <Input
                  type="text"
                  id="TXNAMT"
                  name="TXNAMT"
                  value={formData.transAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ORDER_DATE">ORDER_DATE</Label>
                <Input
                  type="text"
                  id="ORDER_DATE"
                  name="ORDER_DATE"
                  value={formData.orderDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="SUCCESS_URL">SUCCESS_URL</Label>
                <Input
                  type="text"
                  id="SUCCESS_URL"
                  name="SUCCESS_URL"
                  value={formData.successUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="FAILURE_URL">FAILURE_URL</Label>
                <Input
                  type="text"
                  id="FAILURE_URL"
                  name="FAILURE_URL"
                  value={formData.failureUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CHECKOUT_URL">CHECKOUT_URL</Label>
                <Input
                  type="text"
                  id="CHECKOUT_URL"
                  name="CHECKOUT_URL"
                  value={formData.checkoutUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CUSTOMER_EMAIL_ADDRESS">CUSTOMER_EMAIL_ADDRESS</Label>
                <Input
                  type="text"
                  id="CUSTOMER_EMAIL_ADDRESS"
                  name="CUSTOMER_EMAIL_ADDRESS"
                  value={formData.customerEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="CUSTOMER_MOBILE_NO">CUSTOMER_MOBILE_NO</Label>
                <Input
                  type="text"
                  id="CUSTOMER_MOBILE_NO"
                  name="CUSTOMER_MOBILE_NO"
                  value={formData.customerMobile}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="SIGNATURE">SIGNATURE</Label>
                <Input
                  type="text"
                  id="SIGNATURE"
                  name="SIGNATURE"
                  value={formData.signature}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="VERSION">VERSION</Label>
                <Input
                  type="text"
                  id="VERSION"
                  name="VERSION"
                  value={formData.version}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TXNDESC">Item Description</Label>
                <Input
                  type="text"
                  id="TXNDESC"
                  name="TXNDESC"
                  value={formData.itemDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="PROCCODE">Proccode</Label>
                <Input
                  type="text"
                  id="PROCCODE"
                  name="PROCCODE"
                  value={formData.proccode}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TRAN_TYPE">Transaction Type</Label>
                <Input
                  type="text"
                  id="TRAN_TYPE"
                  name="TRAN_TYPE"
                  value={formData.tranType}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="STORE_ID">Store ID/Terminal ID (optional)</Label>
                <Input
                  type="text"
                  id="STORE_ID"
                  name="STORE_ID"
                  value={formData.storeId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="RECURRING_TXN">Create Recurring Token</Label>
                <Select value={formData.recurringTxn} onValueChange={(value) => handleSelectChange('recurringTxn', value)}>
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