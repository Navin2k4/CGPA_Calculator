import React from 'react'
import { Timeline, Accordion } from "flowbite-react";
import { FaPlusMinus } from "react-icons/fa6";
import { SiCoursera } from "react-icons/si";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoSend } from "react-icons/io5";

const HowToUse = () => {
    return (
            <div>
                <Accordion collapseAll className='mb-6 bg-gradient-to-t from-blue-700 to-[#0f172a]'>
                    <Accordion.Panel>
                        <Accordion.Title className='bg-black hover:bg-[#131f39] transition-all duration-300 font-semibold tracking-wider text-white focus:ring-0'>How To Use?</Accordion.Title>
                        <Accordion.Content className='px-8'>
                            <Timeline className=''>
                                <Timeline.Item>
                                    <Timeline.Point icon={FaPlusMinus} />
                                    <Timeline.Content className='px-2'>
                                        <Timeline.Time className="text-white">STEP 1</Timeline.Time>
                                        <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Select Number of Semesters</Timeline.Title>
                                        <Timeline.Body className="text-white">
                                            Click the (-) or (+) buttons to decrease or increase the number of semesters.
                                            <Accordion collapseAll className='mt-4'>
                                                <Accordion.Panel>
                                                    <Accordion.Title className='bg-black hover:bg-[#131f39] transition-all duration-300 font-semibold tracking-wider text-white focus:ring-0'>Have Electives? (From 5th Semester)</Accordion.Title>
                                                    <Accordion.Content className='px-8'>
                                                        <Timeline>
                                                            <Timeline.Item>
                                                                <Timeline.Point icon={FaPlusMinus} />
                                                                <Timeline.Content className='px-4'>
                                                                    <Timeline.Time className="text-white">STEP 1</Timeline.Time>
                                                                    <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Select Number of Electives</Timeline.Title>
                                                                    <Timeline.Body className="text-white">
                                                                        Click the (-) or (+) buttons to decrease or increase the number of electives.
                                                                    </Timeline.Body>
                                                                </Timeline.Content>
                                                            </Timeline.Item>
                                                            <Timeline.Item>
                                                                <Timeline.Point icon={SiCoursera} />
                                                                <Timeline.Content className='px-4'>
                                                                    <Timeline.Time className="text-white">STEP 2</Timeline.Time>
                                                                    <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Select the Course</Timeline.Title>
                                                                    <Timeline.Body className="text-white">
                                                                        Select the elective course by clicking the course name dropdown menu.
                                                                    </Timeline.Body>
                                                                </Timeline.Content>
                                                            </Timeline.Item>
                                                            <Timeline.Item>
                                                                <Timeline.Point icon={IoIosArrowDropdownCircle} />
                                                                <Timeline.Content className='px-4'>
                                                                    <Timeline.Time className="text-white">STEP 3</Timeline.Time>
                                                                    <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Select the Grade</Timeline.Title>
                                                                    <Timeline.Body className="text-white">
                                                                        Select the grade you obtained from the dropdown list.
                                                                    </Timeline.Body>
                                                                </Timeline.Content>
                                                            </Timeline.Item>
                                                            <Timeline.Item>
                                                                <Timeline.Point icon={FaArrowRight} />
                                                                <Timeline.Content className='px-4'>
                                                                    <Timeline.Time className="text-white">STEP 4</Timeline.Time>
                                                                    <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Continue to Step 3</Timeline.Title>
                                                                </Timeline.Content>
                                                            </Timeline.Item>
                                                        </Timeline>
                                                    </Accordion.Content>
                                                </Accordion.Panel>
                                            </Accordion>
                                        </Timeline.Body>
                                    </Timeline.Content>
                                </Timeline.Item>
                                <Timeline.Item>
                                    <Timeline.Point icon={IoIosArrowDropdownCircle} />
                                    <Timeline.Content className='px-2'>
                                        <Timeline.Time className="text-white">STEP 2</Timeline.Time>
                                        <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Select the Grade</Timeline.Title>
                                        <Timeline.Body className="text-white">
                                            Select the grade you obtained from the dropdown list.
                                        </Timeline.Body>
                                    </Timeline.Content>
                                </Timeline.Item>
                                <Timeline.Item>
                                    <Timeline.Point icon={IoSend} />
                                    <Timeline.Content className='px-2'>
                                        <Timeline.Time className="text-white">STEP 3</Timeline.Time>
                                        <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Submit the Data</Timeline.Title>
                                        <Timeline.Body className="text-white">
                                            After selecting the grades, click the "Calculate CGPA" button to see your overall result.
                                        </Timeline.Body>
                                    </Timeline.Content>
                                </Timeline.Item>
                                <Timeline.Item>
                                    <Timeline.Point icon={FaDownload} />
                                    <Timeline.Content className='px-2'>
                                        <Timeline.Time className="text-white">STEP 4</Timeline.Time>
                                        <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Download Your Result</Timeline.Title>
                                        <Timeline.Body className="text-white">
                                            Scroll down to the end and click the "Download File" button to download your result sheet.
                                        </Timeline.Body>
                                    </Timeline.Content>
                                </Timeline.Item>
                                <Timeline.Item>
                                    <Timeline.Point icon={MdError} />
                                    <Timeline.Content className='px-2'>
                                        <Timeline.Title className=' text-white hover:tracking-widest transition-all duration-300'>Facing Any Issues?</Timeline.Title>
                                        <Timeline.Body className="text-white">
                                            Report the issue by clicking the "Submit Report" button on the header and submitting the issue form.
                                        </Timeline.Body>
                                    </Timeline.Content>
                                </Timeline.Item>
                            </Timeline>
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion>
            </div>
    );
};

export default HowToUse;