import { mdiAccount, mdiMail, mdiPhone, mdiLock } from '@mdi/js';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import CardBox from '../../components/CardBox';
import FormField from '../../components/Form/Field';
import SectionMain from '../../components/Section/Main';
import SectionTitle from '../../components/Section/Title';
import { getPageTitle } from '../../config';
import { apiClient } from '../../stores/api/apiCLient';

const CreateUser = () => {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Only numbers are allowed') 
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number can be at most 15 digits')
      .required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values: { name: string; email: string; phone: string; password: string }) => {
    try {
      await apiClient.post('/users', { ...values, role: 'USER' });
      router.push('/users');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Create User')}</title>
      </Head>

      <SectionMain>
        <SectionTitle>Create New User</SectionTitle>
        <CardBox>
          <Formik
            initialValues={{ name: '', email: '', phone: '', password: '' }}
            validationSchema={validationSchema} 
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <FormField label="Full Name" icons={[mdiAccount]}>
                  <Field name="name" placeholder="Full name" required />
                  {errors.name && touched.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                </FormField>

                <FormField label="Email" icons={[mdiMail]}>
                  <Field type="email" name="email" placeholder="Email" required />
                  {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </FormField>

                <FormField label="Phone" icons={[mdiPhone]}>
                  <Field type="tel" name="phone" placeholder="Phone Number" required />
                  {errors.phone && touched.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                </FormField>

                <FormField label="Password" icons={[mdiLock]}>
                  <Field type="password" name="password" placeholder="Password" required />
                  {errors.password && touched.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                </FormField>

                <Button type="submit" color="info" label="Create" disabled={isSubmitting} />
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

export default CreateUser;
