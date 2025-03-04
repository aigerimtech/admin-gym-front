"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import SectionFullScreen from "../components/Section/FullScreen";
import LayoutGuest from "../layouts/Guest";
import { getPageTitle } from "../config";
import { useAuthStore } from "../stores/auth/authStore";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().matches(/^[0-9]+$/, "Phone must be only digits").required("Phone is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const RegisterPage = () => {
  const router = useRouter();
  const registerAll = useAuthStore((state) => state.registerAll);

  const handleSubmit = async (
    values: { first_name: string; last_name: string; email: string; phone: string; password: string },
    { setSubmitting, setErrors }: any
  ) => {
    setSubmitting(true);
  
    const userData = { 
      ...values, 
      role: "user" as const,
      access_level: "client" as const
    };
  
    try {
      const message = await registerAll(userData);
      
      if (message.toLowerCase().includes("successful")) {
        router.push("/login");
      } else {
        setErrors({ email: message });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({ email: "Registration failed. Please try again." });
    }
  
    setSubmitting(false);
  };
  

  return (
    <>
      <Head>
        <title>{getPageTitle("Register")}</title>
      </Head>
      <SectionFullScreen bg="purplePink">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register</h2>
          <Formik
            initialValues={{ first_name: "", last_name: "", email: "", phone: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">First Name</label>
                <Field name="first_name" className="w-full px-4 py-2 border rounded-full border-gray-300" />
                <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Last Name</label>
                <Field name="last_name" className="w-full px-4 py-2 border rounded-full border-gray-300" />
                <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <Field name="email" type="email" className="w-full px-4 py-2 border rounded-full border-gray-300" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Phone</label>
                <Field name="phone" className="w-full px-4 py-2 border rounded-full border-gray-300" />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Password</label>
                <Field name="password" type="password" className="w-full px-4 py-2 border rounded-full border-gray-300" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button type="submit" label="Register" color="info" className="w-full rounded-full" />
            </Form>
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  );
};

RegisterPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};

export default RegisterPage;
