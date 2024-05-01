import classNames from 'classnames/bind';
import styles from './AddressSelect.module.scss';

const cx = classNames.bind(styles);

function AddressSelect({ disabled = false, children, className, label, value, onClick, onChange, ...passProps }) {
    let Comp = 'select';
    const props = {
        onClick,
        onChange,
        value,
        ...passProps,
    };

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    const classes = cx('wrapper', {
        [className]: className,
        disabled,
    });

    return (
        <>
            <Comp aria-label={label} className={classes} {...props}>
                {children.map((item) => (
                    <option key={item.code} value={item.code}>
                        {item.name}
                    </option>
                ))}
            </Comp>
        </>
    );
}

export default AddressSelect;
