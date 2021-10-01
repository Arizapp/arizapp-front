import './index.scss';
import './default.scss';
import { ButtonHTMLAttributes } from 'react';

type buttonDefaultProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;//Testando typagem
}
export function ButtonDefault(props: buttonDefaultProps) {
    return (
        <button className={'btn btn-default' + (props.className || '')} onClick={(props?.onClick ? props.onClick : (ev) => { })} {...props}>
            { props.children || ' - '}
        </button >
    );
}