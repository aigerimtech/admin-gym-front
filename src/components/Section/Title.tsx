import React, { ReactNode } from 'react';
import IconRounded from "../Icon/Rounded";

type Props = {
  custom?: boolean;
  first?: boolean;
  last?: boolean;
  icon: any;
  className?: string; // Added className prop
  children: ReactNode;
};

const SectionTitle = ({ custom = false, first = false, last = false, className = '', children, icon }: Props) => {
  return (
      <section className={`pt-6 mb-6 flex items-center justify-between`}>
        <div className="flex items-center justify-start">
            {icon && <IconRounded icon={icon} color="light" className="mr-3" bg />}
          <h1 className={`leading-tight text-3xl`}>{children}</h1>
        </div>
      </section>
  );
};

export default SectionTitle;
