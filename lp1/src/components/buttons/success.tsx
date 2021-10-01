import './index.scss';
import './success.scss';

type buttonDefaultProps = {
    children?: string,
    className?: string,
}
export function ButtonSuccess(props: buttonDefaultProps) {
    return (
        <button className={'btn btn-success' + (props.className || '')} {...props}>
            {props.children || ' - '}
        </button>
    );
}