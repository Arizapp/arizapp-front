import './index.scss';
import './primary.scss';

type buttonDefaultProps = {
    children?: string,
    className?: string,
}
export function ButtonPrimary(props: buttonDefaultProps) {
    return (
        <button className={'btn btn-primary ' + (props?.className || '')}>
            {props?.children || ' - '}
        </button>
    );
}