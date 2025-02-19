"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import SectionFullScreen from "../components/Section/FullScreen";
import LayoutGuest from "../layouts/Guest";
import { getPageTitle } from "../config";
import { useAuthStore } from "../stores/authStore";
import axios from "axios";

const validationSchema = Yup.object().shape({
  login: Yup.string().required("Username or email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const message = await login({ email: values.login, password: values.password });
  
    if (message === "Logged in successfully!") {
      router.push("/dashboard");
    } else {
      setErrors({ login: message });
    }
    setSubmitting(false);
  };
  

  return (
    <>
      <Head>
        <title>{getPageTitle("Login")}</title>
      </Head>

      <SectionFullScreen bg="purplePink">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
          <Formik
            initialValues={{ login: "", password: "", remember: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">Username or Email</label>
                  <Field
                    name="login"
                    className="w-full px-4 py-2 border rounded-full focus:ring-2 border-gray-300"
                  />
                  <ErrorMessage name="login" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full px-4 py-2 border rounded-full focus:ring-2 border-gray-300"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex items-center">
                  <Field type="checkbox" name="remember" />
                  <label className="ml-2 text-sm text-gray-700">Remember me</label>
                </div>

                <div className="mt-4">
                  <Button type="submit" label="Login" color="info" className="w-full rounded-full " />
                  <Button href="/register" label="Register" color="info" outline className="w-full mt-2 rounded-full " />
                </div>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  );
};

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};

export default LoginPage;
