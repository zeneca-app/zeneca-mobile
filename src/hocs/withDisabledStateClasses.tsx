import React, { cloneElement, ReactElement, ReactNode } from "react";

type WithDisabledProps = {
    disabled?: boolean;
    className?: string;
    disabledClasses?: string;
    children: ReactNode;
};

// HOC that applies conditional classes to all children
const withDisabledClass = <T extends object>(
    WrappedComponent: React.ComponentType<T>,
) => {
    const WithDisabledClassComponent = ({
        disabled,
        className = "",
        children,
        disabledClasses = "",
        ...restProps
    }: T & WithDisabledProps) => {
        // Define the conditional classes based on the `disabled` prop

        // Merge conditional classes with any existing classes
        const mergedClassName =
            `${className} ${disabled ? disabledClasses : ""}`.trim();

        // Apply the merged classes to each child if it's a valid React element
        const renderChildrenWithClasses = (children: ReactNode) => {
            return React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? cloneElement(child as ReactElement, {
                        className:
                            `${child.props.className ?? ""} ${mergedClassName}`.trim(),
                    })
                    : child,
            );
        };

        return (
            <WrappedComponent {...(restProps as T)}>
                {renderChildrenWithClasses(children)}
            </WrappedComponent>
        );
    };

    WithDisabledClassComponent.displayName = `WithDisabledClass(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return WithDisabledClassComponent;
};

withDisabledClass.displayName = "withDisabledClass";

export default withDisabledClass;