import { Logo } from "../(browse)/_components/navbar/logo";

const AuthLayout = ({
    children
    }: {
    children: React.ReactNode;
    }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-6">
            <Logo/>
            {children}
        </div>
    );
};
export default AuthLayout;
