// ui-kit.js
import styled, { css } from 'styled-components';

/* -------------------- Helpers -------------------- */

export const Screen = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-primary);
`;

const focusRing = css`
  outline: none;
  box-shadow: var(--ring);
`;

const clickable = css`
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

/* -------------------- Typography -------------------- */

export const H1 = styled.h1`
  margin: 8px 0;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
`;

export const H2 = styled.h2`
  margin: 16px 2px 8px;
  font-size: 14px;
  font-weight: 700;
`;

export const Text = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--color-text);
`;

export const Muted = styled.span`
  color: var(--color-textSecondary);
`;

/* -------------------- Inputs -------------------- */

export const Input = styled.input`
  width: 100%;
  height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-secondary);
  background: #eaf1f7;
  padding: 10px 12px;
  font-size: 15px;

  &::placeholder {
    color: color-mix(in srgb, var(--color-textSecondary) 85%, white);
  }
  &:focus {
    border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-secondary));
    ${focusRing}
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 96px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-secondary);
  background: #eaf1f7;
  padding: 10px 12px;
  font-size: 15px;
  resize: vertical;
  &:focus {
    border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-secondary));
    ${focusRing}
  }
`;

export const Label = styled.label`
  display: inline-block;
  margin: 0 0 6px 2px;
  font-size: 12px;
  color: var(--color-text);
  opacity: 0.9;
`;

export const Helper = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-textSecondary);
`;

export const Field = styled.div`
  margin: 10px 0 12px;
`;

/* -------------------- Buttons -------------------- */

const buttonBase = css`
  ${clickable};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  height: 48px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 15px;
  border: 1px solid transparent;
  transition:
    transform 0.02s ease,
    filter 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = styled.button<{ variant?: string; full?: boolean }>`
  ${buttonBase};
  background: ${({ variant }) =>
    variant === 'outline'
      ? 'transparent'
      : variant === 'subtle'
        ? '#eaf1f7'
        : 'var(--color-accent)'};
  color: ${({ variant }) => (variant === 'outline' ? 'var(--color-text)' : '#fff')};
  border-color: ${({ variant }) =>
    variant === 'outline' ? 'var(--color-secondary)' : 'transparent'};
  width: ${({ full }) => (full ? '100%' : 'auto')};

  &:hover {
    filter: ${({ variant }) => (variant ? 'none' : 'brightness(1.03)')};
    background: ${({ variant }) =>
      variant === 'outline'
        ? 'color-mix(in srgb, var(--color-secondary) 18%, transparent)'
        : variant === 'subtle'
          ? '#e3ecf5'
          : 'color-mix(in srgb, var(--color-accent) 92%, white 8%)'};
  }

  &:focus-visible {
    ${focusRing};
  }
`;

/* Small/Medium sizes */
export const ButtonSm = styled(Button)`
  height: 36px;
  padding: 0 12px;
  font-weight: 600;
  font-size: 13px;
  border-radius: 10px;
`;

/* -------------------- Header / AppBar -------------------- */

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  gap: 4px;
  padding: 10px 8px 6px;
  background: var(--color-primary);
  backdrop-filter: saturate(1.1);
`;

export const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
`;

export const IconButton = styled.button`
  ${clickable};
  height: 36px;
  width: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  &:hover {
    background: color-mix(in srgb, var(--color-secondary) 22%, transparent);
  }
  &:focus-visible {
    ${focusRing};
  }
`;

/* -------------------- Card -------------------- */

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
`;

export const CardBody = styled.div`
  padding: 12px;
`;

export const Divider = styled.hr`
  height: 1px;
  border: 0;
  background: var(--line);
  margin: 8px 0;
`;

/* -------------------- Pills (Payment / Filters) -------------------- */

export const Pills = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Pill = styled.button<{ $selected?: boolean }>`
  ${clickable};
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ $selected }) => ($selected ? 'var(--color-accent)' : 'var(--color-secondary)')};
  background: ${({ $selected }) =>
    $selected ? 'color-mix(in srgb, var(--color-accent) 10%, white)' : 'white'};
  color: ${({ $selected }) => ($selected ? 'var(--color-accent)' : 'var(--color-text)')};
  font-size: 14px;
  &:focus-visible {
    ${focusRing};
  }
`;

/* -------------------- Progress -------------------- */

export const Progress = styled.div.attrs<{ value?: number }>(({ value = 0 }) => ({
  role: 'progressbar',
  'aria-valuemin': 0,
  'aria-valuemax': 100,
  'aria-valuenow': Math.max(0, Math.min(100, value)),
}))`
  height: 6px;
  width: 100%;
  background: #dfe7ef;
  border-radius: 999px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    width: ${({ value = 0 }) => `${Math.max(0, Math.min(100, value))}%`};
    background: var(--color-accent);
    border-radius: inherit;
    transition: width 0.25s ease;
  }
`;

/* -------------------- List Row (Orders) -------------------- */

export const ListRow = styled.button`
  ${clickable};
  width: 100%;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 8px 2px;
  background: transparent;
  border: none;
  text-align: left;

  &:focus-visible {
    ${focusRing};
  }
`;

export const RowThumb = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--line);
`;

export const RowTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
`;
export const RowSub = styled.div`
  font-size: 12px;
  color: var(--color-textSecondary);
`;
export const RowRight = styled.div`
  font-weight: 700;
`;

/* Status Dot */
export const Dot = styled.span<{ color?: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color = '#23c55e' }) => color};
  display: inline-block;
`;

/* -------------------- Switch -------------------- */

export const Switch = styled.button<{ checked?: boolean }>`
  ${clickable};
  width: 48px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid var(--color-secondary);
  background: ${({ checked }) => (checked ? 'var(--color-accent)' : '#eaf1f7')};
  position: relative;
  padding: 0;
  border: 0;
  transition: background 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ checked }) => (checked ? '22px' : '3px')};
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    box-shadow: var(--shadow-sm);
    transition: left 0.15s ease;
  }

  &:focus-visible {
    ${focusRing};
  }
`;

/* -------------------- Bottom Tab Bar -------------------- */

export const TabBar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  background: #fff;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 6px 10px 8px;
  z-index: 5;
`;

export const TabItem = styled.button<{ $active?: boolean }>`
  ${clickable};
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  gap: 4px;
  color: ${({ $active }) => ($active ? 'var(--color-accent)' : '#5b6b7f')};
  font-size: 11px;
`;

export const TabIcon = styled.div`
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
`;

/* -------------------- Layout helpers -------------------- */

export const Stack = styled.div<{ dir?: string; gap?: number }>`
  display: flex;
  flex-direction: ${({ dir = 'column' }) => dir};
  gap: ${({ gap = 12 }) => `${gap}px`};
`;

export const Spacer = styled.div`
  flex: 1 0 auto;
`;

export const SafeBottom = styled.div`
  height: calc(64px + env(safe-area-inset-bottom));
`;

/* ---------- BottomSheet (модальне дно) ---------- */

export const SheetOverlay = styled.div<{ $open?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(6, 14, 24, 0.28);
  backdrop-filter: saturate(1.1) blur(2px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.18s ease;
  z-index: 40;
`;

export const BottomSheet = styled.div<{ $open?: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: var(--shadow-md);
  transform: translateY(${({ $open }) => ($open ? '0%' : '104%')});
  transition: transform 0.22s ease;
  z-index: 41;
  padding: 10px 12px 12px;
`;

export const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: var(--line);
  margin: 4px auto 8px;
`;

export const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 2px 8px;
`;
export const SheetTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  flex: 1;
`;

/* ---------- Toast (простий тост) ---------- */
export const ToastBar = styled.div<{ $show?: boolean }>`
  position: fixed;
  left: 50%;
  bottom: calc(72px + env(safe-area-inset-bottom));
  transform: translateX(-50%) translateY(${({ $show }) => ($show ? '0' : '16px')});
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  pointer-events: none;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  z-index: 50;
  background: #0b1220;
  color: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  box-shadow: var(--shadow-md);
`;

/* ---------- Select (стилізований native) ---------- */
export const Select = styled.select`
  width: 100%;
  height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-secondary);
  background: #eaf1f7;
  padding: 0 12px;
  font-size: 15px;
  &:focus {
    box-shadow: var(--ring);
    border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-secondary));
  }
`;

/* ---------- Avatar (з fallback) ---------- */
export const AvatarWrap = styled.div<{ size?: number }>`
  width: ${({ size = 88 }) => `${size}px`};
  height: ${({ size = 88 }) => `${size}px`};
  border-radius: 50%;
  border: 2px solid var(--line);
  background: #f1f5f9;
  display: grid;
  place-items: center;
  overflow: hidden;
`;

/* -------------------- Minimal inline icons -------------------- */

import { FiEdit as IconEdit } from 'react-icons/fi';
import { FiChevronRight as IconChevron } from 'react-icons/fi';
import { TfiBackLeft as IconBack } from 'react-icons/tfi';
import { FiSearch as IconSearch } from 'react-icons/fi';
import { BsBasket2Fill as IconCart } from 'react-icons/bs';
import { FiPlus as IconPlus } from 'react-icons/fi';
import { FiMenu as IconMenu } from 'react-icons/fi';
import { BsChatLeftText as IconChat } from 'react-icons/bs';
import { FiUser as IconUser } from 'react-icons/fi';

export {
  IconEdit,
  IconUser,
  IconChevron,
  IconChat,
  IconBack,
  IconSearch,
  IconCart,
  IconPlus,
  IconMenu,
};
