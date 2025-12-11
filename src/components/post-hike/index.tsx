"use client";

import { Tab, Tabs } from "@mui/material";
import MainCard from "@/components/main-card";
import PostHikeCards from "@/components/post-hike/post-hike-cards";
import PostHikeForm from "@/components/post-hike/entry";
import TabPanel from "../tabs";
import { useTabs } from "./hook";
import React from "react";

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const PostHikeComp = () => {
  const { value, handleChange } = useTabs();
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
      <TabPanel value={value} index={1}>
        <PostHikeForm />
      </TabPanel>
    </MainCard>
  );
};

export default PostHikeComp;
