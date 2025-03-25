"use client";

import { Tab, Tabs, Box } from "@mui/material";
import MainCard from "@/components/main-card";
import { useState, SyntheticEvent } from "react";
import PostHikeCards from "@/components/post-hike/post-hike-cards";
import PostHikeForm from "@/components/post-hike/entry";

type TabPanelProps = {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      // style={{ display: value !== index ? "none" : "block" }}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const PostHikeComp = () => {
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [value, setValue] = useState(0);
  return (
    <MainCard>
      <Tabs centered variant="fullWidth" value={value} onChange={handleChange}>
        <Tab
          sx={{
            flexGrow: 1,
          }}
          value={0}
          label="反省を見る"
          {...a11yProps(0)}
        />
        <Tab
          sx={{
            flexGrow: 1,
          }}
          value={1}
          label="反省を入力"
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <PostHikeCards />
      </TabPanel>
      {/* <TabPanel value={value} index={0}>
        <PostHikeCards />
      </TabPanel> */}
      <TabPanel value={value} index={1}>
        <PostHikeForm />
      </TabPanel>
    </MainCard>
  );
};

export default PostHikeComp;
