import { Link, useLocation } from "react-router-dom";
import { publicOnly, authOnly } from "./data";
import { Collapse } from "./Collapse";
import { useAuth } from "../../contexts/AuthProvider";

const style = {
  active: "font-normal mx-4 text-sm text-blue-600",
  inactive: "font-light mx-4 text-sm text-gray-900",
  link: "inline-flex items-center justify-start my-1 p-3 text-black",
};

export function SidebarItems() {
  const { token } = useAuth();
  const { pathname } = useLocation();
  return (
    <ul className="mt-6 md:pl-6">
      <li>
        {publicOnly.map(({ section, icon, content, link }, idx) => {
          if (link) {
            return (
              <div
                className="my-2 flex justify-start px-4 py-6 text-sm text-black"
                key={`${section}-${idx}`}
              >
                <span>{icon}</span>
                <Link to={link}>
                  <span className="pl-3">{section}</span>
                </Link>
              </div>
            );
          }
          return (
            <Collapse key={section}>
              <div className="flex">
                <span>{icon}</span>
                <span className="pl-3">{section}</span>
              </div>
              {content &&
                content.map((item) => (
                  <div className="pl-5" key={item.title}>
                    <Link to={item.link}>
                      <span className={style.link}>
                        <span
                          className={
                            item.link === pathname
                              ? style.active
                              : style.inactive
                          }
                        >
                          {item.title}
                        </span>
                      </span>
                    </Link>
                  </div>
                ))}
            </Collapse>
          );
        })}
        {token &&
          authOnly.map(({ section, icon, content, link }, idx) => {
            if (link) {
              return (
                <div
                  className="my-2 flex justify-start px-4 py-6 text-sm text-black"
                  key={`${section}-${idx}`}
                >
                  <span>{icon}</span>
                  <Link to={link}>
                    <span className="pl-3">{section}</span>
                  </Link>
                </div>
              );
            }
            return (
              <Collapse key={section}>
                <div className="flex">
                  <span>{icon}</span>
                  <span className="pl-3">{section}</span>
                </div>
                {content &&
                  content.map((item) => (
                    <div className="pl-5" key={item.title}>
                      <Link to={item.link}>
                        <span className={style.link}>
                          <span
                            className={
                              item.link === pathname
                                ? style.active
                                : style.inactive
                            }
                          >
                            {item.title}
                          </span>
                        </span>
                      </Link>
                    </div>
                  ))}
              </Collapse>
            );
          })}
      </li>
    </ul>
  );
}
