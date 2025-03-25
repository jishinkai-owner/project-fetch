import { Typography, Link, Box, Breadcrumbs } from "@mui/material";
import { usePathname } from "next/navigation";

type breadcrumbItemProps = {
  items: { [key: string]: string };
};

const BreadcrumbsComp = ({ items }: breadcrumbItemProps) => {
  const path = usePathname();
  const pathnames = path.split("/").filter((x) => x);

  return (
    <Box component="nav" sx={{ ml: 2, mb: 2 }}>
      <Breadcrumbs separator=">">
        {pathnames.map((pathname, index) => {
          const href = "/" + pathnames.slice(0, index + 1).join("/");
          const breadcrumbLabel = items[href] || pathnames;
          return (
            <Link underline="hover" key={pathname} href={href}>
              <Typography variant="body2">{breadcrumbLabel}</Typography>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsComp;
