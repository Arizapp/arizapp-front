import './index.scss';
import './danger.scss';

type buttonDefaultProps = {
    children?: string,
    className?: string,
}
export function ButtonDanger(props: buttonDefaultProps) {
    return (
        <button className={'btn btn-danger' + (props.className || '')} {...props}>
            {props.children || ' - '}
        </button>
    );
}