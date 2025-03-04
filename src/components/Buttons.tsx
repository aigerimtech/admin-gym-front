import React, { Children, cloneElement, ReactElement } from 'react';
import type { ReactNode } from 'react';

type Props = {
    type?: string;
    mb?: string;
    noWrap?: boolean;
    classAddon?: string;
    children: ReactNode;
    className?: string;
};

// Define the type for the child element's props
type ChildProps = {
    className?: string;
    [key: string]: any; // Allow any other props
};

const Buttons = ({
                     type = 'justify-start',
                     mb = '-mb-3',
                     classAddon = 'mr-3 last:mr-0 mb-3',
                     noWrap = false,
                     children,
                     className,
                 }: Props) => {
    return (
        <div
            className={`flex items-center ${type} ${className} ${mb} ${
                noWrap ? 'flex-nowrap' : 'flex-wrap'
            }`}
        >
            {Children.map(children, (child) =>
                React.isValidElement<ChildProps>(child) // Explicitly type the child element
                    ? cloneElement(child, {
                        className: `${classAddon} ${child.props.className || ''}`,
                    })
                    : child
            )}
        </div>
    );
};

export default Buttons;