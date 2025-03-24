// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
// import { toast } from '@/components/toast';

// const Page = () => {
//   const router = useRouter();
//   const { token } = router.query;

//   useEffect(() => {
//     if (token) {
//       fetch(`/api/account/activate?token=${token}`)
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.message) {
//             toast({
//               type: 'success',
//               description: data.message,
//             });
//             setTimeout(() => {
//                 router.push('/login');
//               }, 3000); 
//           } else {
//             toast({
//               type: 'error',
//               description: 'Account activation failed. Please request a new link.',
//             });
//           }
//         })
//         .catch((error) => {
//           toast({
//             type: 'error',
//             description: 'Error activating account. Please try again later.',
//           });
//         });
//     }
//   }, [token, router]);

//   return <div>Activating your account...</div>;
// };

// export default Page;