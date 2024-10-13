import '../../public/plugins/fontawesome-free/css/all.min.css';
import '../../public/dist/css/adminlte.min.css';

export default function SingInLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className='hold-transition login-page'> {children}</div>
        </>
    );
}