import { ButtonHTMLAttributes } from 'react';
import './index.scss';
import './primary.scss';

type buttonDefaultProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;//Testando typagem
}
export function ButtonPrimary(props: buttonDefaultProps) {
    return (
        <button className={'btn btn-primary' + (props.className || '')} onClick={(props?.onClick ? props.onClick : (ev) => { })} {...props}>
            {props?.children || ' - '}
        </button>
    );
}