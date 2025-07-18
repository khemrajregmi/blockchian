import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { ListBox } from "components/ListBox";
import { UploadAvatar } from "components/UploadAvatar/UploadAvatar";
import { DialogCrossButton } from "components/DialogCrossButton";
import { InvitationRow } from "components/InvitationRow";
import InputComponent from 'components/InputComponent';
import PlaceholderFile from "assets/placeholder-file.svg";
import ConfirmationTick from "assets/confirm-tick.svg";
import Member1 from "assets/member-1.png";
import Member2 from "assets/member-2.png";
import Member3 from "assets/member-3.png";
import { DialogSheet } from "components/DialogSheet";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UploadBannerProps {
  bannerPicPath: string;
  onClick: () => void;
}
function UploadBanner({ bannerPicPath, onClick }: UploadBannerProps) {
  return (
    <div className='flex w-full flex-col items-center gap-y-4 rounded-half border border-grey-high bg-dim-black p-5'>
      {bannerPicPath === "" ? (
        <>
          <img src={PlaceholderFile} />
          <p>
            <span onClick={onClick} className='cursor-pointer font-medium text-white underline hover:text-blue-high'>
              Click to upload
            </span>{" "}
            <span className='text-dim-white'>or drag and drop</span>
          </p>
          <p className='text-sm text-dim-white'>JPG or PNG (max 800 x 400 px)</p>
        </>
      ) : (
        <img className='shrink-0' src={bannerPicPath} />
      )}
    </div>
  );
}

interface TeamFormProp {
  onClose: () => void;
  onCreate: () => void;
}

interface SportType {
  id: string;
  name: string;
  [key: string]: any;
}
interface FriendType {
  _id: string;
  fname: string;
  lname: string;
  [key: string]: any;
}

function TeamForm({ onClose, onCreate }: TeamFormProp) {
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState<any>("");
  const [admin, setAdmin] = useState(false);
  const [sportsData, setSportsData] = useState<SportType[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string | undefined>(undefined);
  const [profilePicPath, setProfilePicPath] = useState<string>("");
  const [bannerPicPath, setBannerPicPath] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [teamDescription, setTeamDescription] = useState<string>("");
  const [members, setTeamMembers] = useState<string[]>([]);
  const [teamGender, setTeamGender] = useState<string | undefined>(undefined);
  const [allFriends, setAllFriends] = useState<FriendType[]>([]);
  const [showFriends, setShowFriends] = useState<FriendType[]>([]);
  const [teamAvatarError, setTeamAvatarError] = useState<boolean>(false);
  const [teamBannerError, setTeamBannerError] = useState<boolean>(false);
  const [teamNameError, setTeamNameError] = useState<boolean>(false);
  const [gameTypeError, setGameTypeError] = useState<boolean>(false);
  const [genderError, setGenderError] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState<string>("");

  const saveProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    let file = e.target.files[0];
    let fileName = e.target.files[0].name;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("token", window.localStorage.getItem("token") || "");

    try {
      const res = await axios.post<{ data: string }>(
        `${API_BASE_URL}/picUpload`,
        formData
      );
      setProfilePicPath(res.data.data);
      setTeamAvatarError(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const saveBannerPic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileName = e.target.files[0].name;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("token", window.localStorage.getItem("token") || "");

    try {
      const res = await axios.post<{ data: string }>(
        `${API_BASE_URL}/picUpload`,
        formData
      );
      setBannerPicPath(res.data.data);
      setTeamBannerError(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const createNewTeam = function () {
    if (!profilePicPath) setTeamAvatarError(true);
    if (!bannerPicPath) setTeamBannerError(true);
    if (!teamName) setTeamNameError(true);
    if (!selectedSportId) setGameTypeError(true);
    if (!teamGender) setGenderError(true);
    if (!teamName || !teamGender || !selectedSportId || !profilePicPath || !bannerPicPath) return;

    fetch(`${API_BASE_URL}/createTeam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        name: teamName,
        description: teamDescription,
        members: members,
        gender: teamGender,
        sportsTypeId: selectedSportId,
        profilePic: profilePicPath,
        profileBanner: bannerPicPath,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data === "token expired") {
          window.localStorage.clear();
          window.location.href = "../../login";
        } else {
          if (data.status === "ok") {
            window.location.href = "../../team/index?id=" + data.data.team;
          }
        }
      });
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/getUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.userType === "Admin") {
          setAdmin(true);
        }
        setUserData(data.data);
        if (data.data === "token expired") {
          window.localStorage.clear();
          window.location.href = "./login";
        }
      });

    fetch(`${API_BASE_URL}/getSports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setSportsData(data.data);
        setLoaded(true);
      });

    fetch(`${API_BASE_URL}/getFriends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllFriends(data.data);
        setShowFriends(data.data);
        if (data.data === "token expired") {
          window.localStorage.clear();
          window.location.href = "./login";
        }
      });
  }, []);

  useEffect(() => {
    if (teamName) setTeamNameError(false);
    if (selectedSportId) setGameTypeError(false);
    if (teamGender) setGenderError(false);
  }, [teamName, selectedSportId, teamGender]);

  const onSelectMember = (selected: boolean, userId: string) => {
    let newMembers: string[];
    if (selected) {
      newMembers = [...members, userId];
    } else {
      newMembers = members.filter((member) => member !== userId);
    }
    setTeamMembers(newMembers);
  };

  const onSelectAllMembers = (selected: boolean) => {
    if (selected) {
      const newMembers = showFriends.map((friend) => friend._id);
      setTeamMembers(newMembers);
    } else {
      setTeamMembers([]);
    }
  };

  const onSelectSportType = (value: string) => {
    setSelectedGame(value);
    sportsData.forEach((data) => {
      if (data.name === value) setSelectedSportId(data.id);
    });
  };

  useEffect(() => {
    if (searchKey) {
      const newFriends = allFriends.filter(
        (friend) =>
          friend.fname.toLowerCase().includes(searchKey.toLowerCase()) ||
          friend.lname.toLowerCase().includes(searchKey.toLowerCase())
      );
      setShowFriends(newFriends);
    } else {
      setShowFriends(allFriends);
    }
  }, [searchKey, allFriends]);

  return (
    <>
      <Dialog.Title as='header' className='relative'>
        <h2 className='mx-16 text-center text-2xl font-bold'>Create Team</h2>
        <DialogCrossButton onClick={onClose} />
      </Dialog.Title>
      <section className='desk-dialog:w-[43.5rem]'>
        <div className='mb-2 flex items-center gap-x-5'>
          <UploadAvatar profilePicPath={profilePicPath} onClick={() => document.getElementById("avatarFileInput")?.click()} />
          <h2 className='text-lg font-medium'>Upload team avatar</h2>
          <input style={{ opacity: "0" }} onChange={saveProfilePic} type="file" name="file" accept="image/png, image/gif, image/jpeg" id="avatarFileInput" className="input-file" />
        </div>
        {teamAvatarError && <div className='mb-6' style={{ color: "red" }}>Please upload avatar</div>}
        {/* Row */}
        <div className='mt-5 flex flex-wrap gap-5'>
          <InputComponent label='Team name' onChange={setTeamName} placeholder='a suitable name for your team' type='text' style='min-w-full' showError={teamNameError} />
        </div>
        {/* Row */}
        <div className='mt-5 flex flex-wrap gap-5'>
          <div className='min-w-[12rem] flex flex-1 flex-col'>
            <ListBox
              label='Game Type'
              placeholder='Sports'
              selected={selectedGame ?? ""}
              onChangeValue={onSelectSportType}
              data={sportsData.map((sport) => sport.name)}
            />
            {gameTypeError && <div className='mt-2' style={{ color: "red" }}>Please select type</div>}
          </div>
          <div className='min-w-[12rem] flex flex-1 flex-col'>
            <ListBox
              label='Gender'
              placeholder='Select'
              selected={teamGender ?? ""}
              onChangeValue={(value: string) => setTeamGender(value)}
              data={["Male", "Female", "Mixed"]}
            />
            {genderError && <div className='mt-2' style={{ color: "red" }}>Please select gender</div>}
          </div>
        </div>
        <div className='mt-5 mb-2'>
          <label className='mb-3 block text-lg font-medium'>Team banner</label>
          <UploadBanner bannerPicPath={bannerPicPath} onClick={() => document.getElementById("bannerFileInput")?.click()} />
          <input style={{ display: "none" }} onChange={saveBannerPic} type="file" name="file" accept="image/png, image/gif, image/jpeg" id="bannerFileInput" className="input-file" />
        </div>
        {teamBannerError && <div style={{ color: "red" }}>Please upload banner</div>}
        {/* Row */}
        <div className='mt-5 flex flex-wrap gap-5'>
          <div className='app-textbox min-w-full sm:min-w-[24rem]'>
            <label>Description</label>
            <div className='app-textbox-area'>
              <textarea onChange={(e) => setTeamDescription(e.target.value)} placeholder='Enter any additional description here' />
            </div>
          </div>
        </div>
        <label className='app-checkbox mt-5'>
          <input type='checkbox' />
          Private team?
          <span className='text-sm text-grey-classic'>
            (If turned on, this team will not be listed in explore teams)
          </span>
        </label>
        <div className='mt-5 flex flex-wrap gap-5'>
          <div className='app-textbox min-w-full sm:min-w-[24rem]'>
            <label>Invite friends</label>
            <div className='app-textbox-area'>
              <input size={1} value={searchKey} onChange={(e) => setSearchKey(e.target.value)} placeholder='Search by name' />
            </div>
          </div>
        </div>
        <label className='app-checkbox mt-5'>
          <input checked={showFriends.length === members.length} onChange={event => onSelectAllMembers(event.target.checked)} type='checkbox' />
          Add all friends
        </label>
        <div className='mt-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2'>
          {showFriends.map((friend, index) =>
            <InvitationRow key={index} info={friend} onSelectMember={onSelectMember} checked={members.indexOf(friend._id) > -1} />
          )}
        </div>
      </section>
      <footer className='mt-20 flex justify-center gap-x-7'>
        <button
          onClick={onClose}
          className='relative flex items-center rounded-half bg-grey-high px-20 py-3 text-dim-white hover:bg-blue-high/10'
        >
          Cancel
        </button>
        <button
          onClick={createNewTeam}
          className='relative flex items-center rounded-half bg-blue-high px-14 py-3 text-dim-black hover:bg-blue-high/80 disabled:bg-blue-high/20'
        >
          Create Team
        </button>
      </footer>
    </>
  );
}

interface ConfirmationProp {
  onClose: () => void;
}
function Confirmation({ onClose }: ConfirmationProp) {
  return (
    <>
      <Dialog.Title as='header' className='relative'>
        {/* <h2 className='mx-16 text-center text-2xl font-bold'></h2> */}
        <DialogCrossButton onClick={onClose} />
        <div className='flex flex-col items-center'>
          <img src={ConfirmationTick} />
          <p className='mt-2 font-medium text-dim-white'>
            Team has been Created
          </p>
          <h1 className='mx-24 mt-5 text-center text-title font-bold'>
            League of Champions
          </h1>
        </div>
        <div className='mt-7 grid grid-cols-[auto_1fr] grid-rows-[repeat(4,auto)]'>
          <p className='mb-4 text-grey-grain'>Sport</p>
          <p className='font-bold'>Soccer</p>
          <p className='mb-4 text-grey-grain'>Gender</p>
          <p className='font-bold'>Male</p>
          <hr className='col-span-full border border-outline-2' />
          <p className='my-4 mr-12 self-center text-grey-grain'>Members</p>
          <div className='flex items-center self-center'>
            <img className='box-content h-5.5 w-5.5 rounded-full border-4 border-grey-low' src={Member1} />
            <img className='-ml-2.5 box-content h-5.5 w-5.5 rounded-full border-4 border-grey-low' src={Member2} />
            <img className='-ml-2.5 box-content h-5.5 w-5.5 rounded-full border-4 border-grey-low' src={Member3} />
            <img className='-ml-2.5 box-content h-5.5 w-5.5 rounded-full border-4 border-grey-low' src={Member3} />
            <p className='ml-3 text-fine'>
              <span className='text-grey-grain'>+ </span>
              <span>32 others</span>
            </p>
          </div>
          <hr className='col-span-full border border-outline-2' />
        </div>
      </Dialog.Title>
      <footer className='mt-9 flex justify-center gap-x-7'>
        <button
          onClick={onClose}
          className='relative flex items-center rounded-half bg-blue-high px-14 py-3 text-dim-black hover:bg-blue-high/80'
        >
          Continue
        </button>
      </footer>
    </>
  );
}

export function TeamCreator({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState(false);

  children = React.Children.only(children);
  const handleElement =
    children &&
    React.cloneElement(children as React.ReactElement, {
      onClick: () => setIsOpen(true)
    });

  return (
    <>
      {handleElement}
      <Transition
        afterLeave={() => {
          setConfirmation(false);
        }}
        show={isOpen}
        as={React.Fragment}
      >
        <Dialog onClose={() => {}}>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <DialogSheet>
              {!confirmation ? (
                <TeamForm
                  onCreate={() => setConfirmation(true)}
                  onClose={() => setIsOpen(false)}
                />
              ) : (
                <Confirmation onClose={() => setIsOpen(false)} />
              )}
            </DialogSheet>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
