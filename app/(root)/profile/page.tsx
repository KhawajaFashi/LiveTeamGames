import { redirect } from 'next/navigation';

const page = () => {
    return (
        redirect('/myprofile')
    )
}

export default page