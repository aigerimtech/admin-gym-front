"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import SectionFullScreen from "../components/Section/FullScreen";
import { getPageTitle } from "../config";
import {AuthState, useAuthStore} from "../stores/auth/authStore";

const validationSchema = Yup.object().shape({
  login: Yup.string().required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const router = useRouter();
  const loginUser = useAuthStore((state: AuthState ) => state.loginUser);

  const handleSubmit = async (values: { login: string; password: string }, { setSubmitting, setErrors }: any) => {
    const message = await loginUser({ email: values.login, password: values.password });
    if (message === "Admin Logged in successfully!") {
      router.push("/admin/users"); // Страница для админа
    } else if (message === "Logged in successfully!") {
      router.push("/dashboard"); // Стандартная страница
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
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <Formik initialValues={{ login: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {() => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">Username or Email</label>
                  <Field name="login" className="w-full px-4 py-2 border rounded-full focus:ring-2 border-gray-300" />
                  <ErrorMessage name="login" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Password</label>
                  <Field name="password" type="password" className="w-full px-4 py-2 border rounded-full focus:ring-2 border-gray-300" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="mt-4">
                  <Button type="submit" label="Login" color="info" className="w-full rounded-full" />
                  <Button href="/register" label="Register" color="info" outline className="w-full mt-2 rounded-full" />
                </div>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  );
};


export default LoginPage;
