import * as React from "react";
import "./Button.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp, SizeProp} from "@fortawesome/fontawesome-svg-core";

interface Props {
    size?: SizeProp;
    icon?: string;
    classNames?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (e) => void;
}

/**
 * My Fancy Button!!!
 * =================
 *
 * Examples:
 * ===
 * ```
 *      // Base:
 *      <Button>My Fancy Button</Button>
 *
 *      // With icon:
 *      <Button icon="stroopwafel">My Fancy Button</Button>
 *
 *      // Only Icon:
 *      <Button icon="stroopwafel" />
 *
 *      // Primary state
 *      <Button classNames="primary">My Fancy Button</Button>
 *
 *      //
 *      //  Disabled state
 *      //
 *      // !!! Disabled state override primary and default state
 *      //
 *      <Button disabled={true}>My Fancy Button</Button>
 * ```
 */
export class Button extends React.Component<Props, {}> {

    public render() {

        const icon = this.renderIcon();

        return  <button
                    disabled={this.props.disabled || this.props.loading }
                    onClick={this.onClickHandler.bind(this)}
                    className={`${this.props.classNames ? this.props.classNames + ' ' : ''}btn ${ this.props.icon ? 'icon':''}`}
                >
                {icon}
                { !this.props.loading ? this.props.children ? ` ${this.props.children}` : '' : 'Loading...'}
                </button>
    }

    private renderIcon() {
        return this.props.icon ? (<FontAwesomeIcon icon={this.props.icon as IconProp} size={this.props.size ? this.props.size as SizeProp : '1x'} />) : null;
    }

    onClickHandler(e) {
        const { onClick } = this.props;

        if (onClick) {
            this.props.onClick(e);
        }
    }

}