"use client";
import HikeInfoEntry from "./register";
import MainCard from "../main-card";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import RegisterHikeEdit from "./edit";

const RegisterHikeComp = () => {
  return (
    <MainCard>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="body2" fontWeight={600}>
            活動を登録する
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <HikeInfoEntry />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="body2" fontWeight={600}>
            活動を編集する
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RegisterHikeEdit />
        </AccordionDetails>
      </Accordion>
    </MainCard>
  );
};

export default RegisterHikeComp;
