"use client";
import React from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import SectionFullScreen from "../components/Section/FullScreen";
import LayoutGuest from "../layouts/Guest";
import { useAuthStore } from "../stores/authStore";
import { getPageTitle } from "../config";

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuthStore();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().matches(/^[0-9]+$/, "Phone must be only digits").required("Phone is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = (values: { name: string; email: string; phone: string; password: string }) => {
    const newMember = { id: Date.now(), ...values };
    const result = register(newMember);

    if (result === "Registration successful!") {
      alert(result);
      router.push("/login");
    }
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
            initialValues={{ name: "", email: "", phone: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">Full Name</label>
                  <Field
                    name="name"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                      touched.name && errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                      touched.email && errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold">Phone</label>
                  <Field
                    name="phone"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                      touched.phone && errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 ${
                      touched.password && errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex justify-between mt-4">
                  <Button type="submit" label="Sign up" color="info" className="w-full mr-2" />
                  <Button href="/login" label="Log in" color="info" outline className="w-full ml-2" />
                </div>
              </Form>
            )}
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
